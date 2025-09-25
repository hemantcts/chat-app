import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from 'react-router-dom';

const AllUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingUserId, setEditingUserId] = useState(null);
    const [formData, setFormData] = useState({});

    const [selectedUserIds, setSelectedUserIds] = useState([]);
    const [selectAll, setSelectAll] = useState(false);

    const [companies, setCompanies] = useState([])
    const [selectedCompany, setSelectedCompany] = useState("");


    const loggedInUser = JSON.parse(localStorage.getItem('userData'))

    const fetchCompanies = async () => {
        try {
            const res = await fetch('https://chat.quanteqsolutions.com/api/admin/companies', {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                },
            });
            const data = await res.json();

            console.log('comany', data.companies)

            if (data.status) {
                setCompanies(data.companies || []);
                setLoading(false);
            } else {
                toast.error(data.message || 'Error!');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error fetching users');
            setLoading(false);
        }
    };

    const fetchUsers = async () => {
        try {
            const res = await fetch('https://chat.quanteqsolutions.com/api/admin/users', {
                headers: {
                    'Authorization': localStorage.getItem('token'),
                },
            });
            const data = await res.json();

            if (data.status) {
                const filterUsers = data.users.filter(user => user._id !== loggedInUser._id)
                setUsers(filterUsers || []);
                setLoading(false);
            } else {
                toast.error(data.message || 'Error!');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error fetching users');
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchCompanies();
    }, []);

    const handleEditClick = (user) => {
        setEditingUserId(user._id);
        setFormData({
            name: user.name,
            email: user.email,
            password: '', // leave empty
            department: user.department,
            // companyName: user.company.companyName,
            companyCode: user?.company?.companyCode,
            groupCreateAccess: user.groupCreateAccess,
            oneOnOneAccess: user.oneOnOneAccess,
            appAccess: user.appAccess,
            deleteMessageAccess: user.deleteMessageAccess,
            active: user.active
        });
    };

    const handleSaveClick = async (userId) => {
        try {
            const res = await fetch(`https://chat.quanteqsolutions.com/api/admin/users/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token'),
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (data.status) {
                toast.success(data.message || 'User updated successfully');
                setEditingUserId(null);
                fetchUsers();
                fetchCompanies();
            } else {
                toast.error(data.message || 'Error updating user');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error updating user');
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: type === 'checkbox' ? checked : value,
        }));
    };


    const handleCheckboxChange = (userId) => {
        setSelectedUserIds(prev =>
            prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
        );
    };

    // const handleSelectAllChange = () => {
    //     if (selectAll) {
    //         setSelectedUserIds([]);
    //     } else {
    //         const allUserIds = users.map(user => user._id);
    //         setSelectedUserIds(allUserIds);
    //     }
    //     setSelectAll(!selectAll);
    // };

    const handleSelectAllChange = () => {
        // Use filteredUsers instead of all users
        const filteredUsers = selectedCompany
            ? users.filter(user => user?.company?.companyCode === selectedCompany)
            : users;

        if (selectAll) {
            setSelectedUserIds([]);
        } else {
            const allUserIds = filteredUsers.map(user => user._id);
            setSelectedUserIds(allUserIds);
        }
        setSelectAll(!selectAll);
    };

    // useEffect(() => {
    //     const allUserIds = users.map(user => user._id);
    //     const allSelected = allUserIds.length > 0 && allUserIds.every(id => selectedUserIds.includes(id));
    //     setSelectAll(allSelected);
    // }, [selectedUserIds, users]);

    useEffect(() => {
        // Only consider currently displayed users (after company filter)
        const filteredUsers = selectedCompany
            ? users.filter(user => user?.company?.companyCode === selectedCompany)
            : users;

        const allUserIds = filteredUsers.map(user => user._id);
        const allSelected = allUserIds.length > 0 && allUserIds.every(id => selectedUserIds.includes(id));
        setSelectAll(allSelected);
    }, [selectedUserIds, users, selectedCompany]);




    const deleteUsers = async () => {
        if (selectedUserIds.length === 0) {
            toast.warning('No users selected');
            return;
        }

        if (!window.confirm(`Are you sure you want to delete ${selectedUserIds.length} user(s)?`)) return;

        try {
            const response = await fetch('https://chat.quanteqsolutions.com/api/admin/delete_users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `${localStorage.getItem('token')}`,
                },
                body: JSON.stringify({ userIds: selectedUserIds }),
            });

            const data = await response.json();
            if (data.status) {
                toast.success(data.message || 'Users deleted successfully');
                setSelectedUserIds([]);
                setSelectAll(false);
                fetchUsers();
                fetchCompanies();
            } else {
                toast.error(data.message || 'Failed to delete users');
            }
        } catch (error) {
            toast.error('Server error');
            console.error(error);
        }
    };

    const filteredUsers = selectedCompany
        ? users.filter(user => user?.company?.companyCode === selectedCompany)
        : users;


    return (
        <div className="nk-chat-body profile-shown px-3 admin-users-list">
            <div className="nk-chat-head border-0 justify-content-between px-0">
                <h4 className='mb-0'>All Users (Admin Panel)</h4>
                <div>
                    <ul className="d-flex">
                        <li className='me-2'>
                            <Link to='/dashboard/chat?add_company' className='btn btn-warning'>Add Company</Link>
                        </li>
                        <li className='me-2'>
                            <Link to='/dashboard/chat?add_user' className='btn btn-primary'>Add Users</Link>
                        </li>
                        <li>
                            <button className='btn btn-danger' onClick={deleteUsers} disabled={selectedUserIds.length === 0}>
                                Delete Users
                            </button>
                        </li>

                        <li>
                            {/* <div className='ms-3' style={{ border: '1px solid #000' }}> */}
                            {/* <Form.Select
                                    // className="ms-3"
                                    style={{ width: '200px' }}
                                    value={selectedCompany}
                                    onChange={(e) => setSelectedCompany(e.target.value)}
                                > */}
                            <Form.Control
                                className='ms-3'
                                style={{ width: '200px' }}
                                as="select"
                                value={selectedCompany}
                                onChange={(e) => setSelectedCompany(e.target.value)}
                            >
                                <option value="">All Companies</option>
                                {companies.map((company) => (
                                    <option key={company._id} value={company?.companyCode}>
                                        {company?.companyName} ({company?.companyCode})
                                    </option>
                                ))}
                            </Form.Control>
                            {/* </div> */}
                        </li>
                    </ul>
                </div>
            </div>

            {false ? (
                <Spinner animation="border" />
            ) : (
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>
                                <Form.Check
                                    type="checkbox"
                                    checked={selectAll}
                                    onChange={handleSelectAllChange}
                                />
                            </th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Password</th>
                            <th>Department</th>
                            <th>Company</th>
                            <th>Create Group Access</th>
                            <th>One-on-One Chat Access</th>
                            <th>App Access</th>
                            <th>Delete Message Access</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            Array.from({ length: 5 }).map((_, index) => (
                                <tr key={index}>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton width={170} /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                    <td><Skeleton /></td>
                                </tr>
                            ))
                        ) : (
                            filteredUsers.map((user) => (
                                <tr key={user._id}>
                                    <td>
                                        <Form.Check
                                            type="checkbox"
                                            checked={selectedUserIds.includes(user._id)}
                                            onChange={() => handleCheckboxChange(user._id)}
                                        />
                                    </td>
                                    <td>
                                        {editingUserId === user._id ? (
                                            <Form.Control
                                                type="text"
                                                name="name"
                                                value={formData.name}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            user.name
                                        )}
                                    </td>
                                    <td>
                                        {editingUserId === user._id ? (
                                            <Form.Control
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            user.email
                                        )}
                                    </td>
                                    <td>
                                        {editingUserId === user._id ? (
                                            <Form.Control
                                                type="password"
                                                name="password"
                                                value={formData.password}
                                                onChange={handleInputChange}
                                                placeholder="Leave empty to keep current password"
                                            />
                                        ) : (
                                            '******'
                                        )}
                                    </td>
                                    <td>
                                        {editingUserId === user._id ? (
                                            <Form.Control
                                                as="select"
                                                name="department"
                                                value={formData.department}
                                                onChange={handleInputChange}
                                                required
                                            >
                                                <option value="Operations Team">Operations Team</option>
                                                <option value="Accounts Team">Accounts Team</option>
                                                <option value="Quality Team">Quality Team</option>
                                                <option value="Contractor Management">Contractor Management</option>
                                                <option value="Contractor">Contractor</option>
                                                <option value="Driver">Driver</option>
                                                <option value="Jockey">Jockey</option>
                                            </Form.Control>
                                        ) : (
                                            user.department
                                        )}
                                    </td>
                                    {user?.company ?
                                        (
                                            <td>
                                                {(editingUserId === user._id) ? (
                                                    <Form.Control
                                                        as="select"
                                                        name="companyCode"
                                                        value={formData?.companyCode}
                                                        onChange={handleInputChange}
                                                        required
                                                    >
                                                        {companies.map((company) => (
                                                            <option key={company?._id} value={company?.companyCode}>
                                                                {company?.companyName} ({company?.companyCode})
                                                            </option>
                                                        ))}
                                                    </Form.Control>
                                                ) : (
                                                    `${user?.company?.companyName} (${user?.company?.companyCode})`
                                                )}
                                            </td>
                                        ) : (
                                            <td> - </td>
                                        )}
                                    <td>
                                        {editingUserId === user._id ? (
                                            <Form.Check
                                                type="checkbox"
                                                name="groupCreateAccess"
                                                className='m-0'
                                                checked={formData.groupCreateAccess}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            user.groupCreateAccess ? 'Yes' : 'No'
                                        )}
                                    </td>
                                    <td>
                                        {editingUserId === user._id ? (
                                            <Form.Check
                                                type="checkbox"
                                                name="oneOnOneAccess"
                                                checked={formData.oneOnOneAccess}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            user.oneOnOneAccess ? 'Yes' : 'No'
                                        )}
                                    </td>
                                    <td>
                                        {editingUserId === user._id ? (
                                            <Form.Check
                                                type="checkbox"
                                                name="appAccess"
                                                checked={formData.appAccess}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            user.appAccess ? 'Yes' : 'No'
                                        )}
                                    </td>
                                    <td>
                                        {editingUserId === user._id ? (
                                            <Form.Check
                                                type="checkbox"
                                                name="deleteMessageAccess"
                                                checked={formData.deleteMessageAccess}
                                                onChange={handleInputChange}
                                            />
                                        ) : (
                                            user.deleteMessageAccess ? 'Yes' : 'No'
                                        )}
                                    </td>
                                    <td>
                                        {editingUserId === user._id ? (
                                            <Form.Check
                                                type="checkbox"
                                                name="active"
                                                checked={formData.active}
                                                onChange={handleInputChange}
                                            />

                                        ) : (
                                            user.active ? 'Active' : 'Inactive'
                                        )}
                                    </td>
                                    <td style={{ display: 'flex', border: '0' }}>
                                        {editingUserId === user._id ? (
                                            <>
                                                <Button variant="success" size="sm" onClick={() => handleSaveClick(user._id)} style={{ padding: '0', marginRight: '0.5rem' }}>
                                                    <svg width="25px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M4.89163 13.2687L9.16582 17.5427L18.7085 8" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </Button>{' '}
                                                <Button variant="danger" size="sm" onClick={() => setEditingUserId(null)} style={{ padding: '0' }}>
                                                    <svg width="27px" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M16 8L8 16M8.00001 8L16 16" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                                    </svg>
                                                </Button>
                                            </>
                                        ) : (
                                            <Button variant="primary" size="sm" onClick={() => handleEditClick(user)}>
                                                Edit
                                            </Button>
                                        )}
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>

                </Table>
            )}
        </div>
    );
};

export default AllUsers;
