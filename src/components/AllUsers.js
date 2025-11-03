import React, { useState, useEffect } from 'react';
import { Form, Button, Table, Spinner } from 'react-bootstrap';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Skeleton from 'react-loading-skeleton'
import 'react-loading-skeleton/dist/skeleton.css'
import { Link } from 'react-router-dom';
import UsersTab from './UsersTab';
import CompanyTab from './CompanyTab';

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
            accessLevel: user.accessLevel,
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
        if(loggedInUser?.accessLevel < 4){
            toast.warning("You don't have access to delete users");
            return
        }
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

        const [panel, setPanel] = useState('users')


    return (
        <div className="nk-chat-body profile-shown px-3 admin-users-list">
            <div className="nk-chat-head border-0 justify-content-between px-0">
                {/* <h4 className='mb-0'>All Users (Admin Panel)</h4> */}
                <div className="d-flex align-items-center">
                    <Form.Control
                        as="select"
                        value={panel}
                        onChange={(e) => setPanel(e.target.value)}
                        style={{ fontWeight: 'bold', fontSize: '18px' }}
                    >
                        <option value="users">All Users (Admin Panel)</option>
                        <option value="companies">All Companies (Admin Panel)</option>
                    </Form.Control>
                </div>
                <div>
                    <ul className="d-flex">
                        <li className='me-2'>
                            <Link to='/dashboard/chat?add_company' className='btn btn-warning'>Add Company</Link>
                        </li>
                        {panel === 'users' && <li className='me-2'>
                            <Link to='/dashboard/chat?add_user' className='btn btn-primary'>Add Users</Link>
                        </li>}
                        {panel === 'users' && <li>
                            <button className='btn btn-danger' onClick={deleteUsers} disabled={selectedUserIds.length === 0}>
                                Delete Users
                            </button>
                        </li>}

                        {panel === 'users' && <li>
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
                        </li>}
                    </ul>
                </div>
            </div>

            {panel !== 'users' ? (
                <CompanyTab
                    selectAll={selectAll}
                    handleSelectAllChange={handleSelectAllChange}
                    loading={loading}
                    filteredUsers={filteredUsers}
                    selectedUserIds={selectedUserIds}
                    handleCheckboxChange={handleCheckboxChange}
                    formData={formData}
                    editingUserId={editingUserId}
                    handleInputChange={handleInputChange}
                    companies={companies}
                    handleSaveClick={handleSaveClick}
                    handleEditClick={handleEditClick}
                    setEditingUserId={setEditingUserId}
                />
            ) : (
                <UsersTab
                    selectAll={selectAll}
                    handleSelectAllChange={handleSelectAllChange}
                    loading={loading}
                    filteredUsers={filteredUsers}
                    selectedUserIds={selectedUserIds}
                    handleCheckboxChange={handleCheckboxChange}
                    formData={formData}
                    editingUserId={editingUserId}
                    handleInputChange={handleInputChange}
                    companies={companies}
                    handleSaveClick={handleSaveClick}
                    handleEditClick={handleEditClick}
                    setEditingUserId={setEditingUserId}
                />

            )}
        </div>
    );
};

export default AllUsers;
