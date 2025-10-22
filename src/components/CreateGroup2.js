import React, { useState, useEffect } from 'react'
import { Form, Button, Spinner } from 'react-bootstrap';
import Multiselect from 'multiselect-react-dropdown';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CreateGroup2 = () => {
    const navigate = useNavigate();
    const [groupName, setGroupName] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState('');
    const [hiddenUsers, setHiddenUsers] = useState([]); // 👈 track hidden
    const [loading, setLoading] = useState(true);

    const loggedInUser = JSON.parse(localStorage.getItem('userData'))


    const [companies, setCompanies] = useState([])

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
            } else {
                toast.error(data.message || 'Error!');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error fetching users');
        }
    };

    useEffect(() => {
        fetchCompanies()
    }, [])

    useEffect(() => {
        // Fetch list of users
        const fetchUsers = async () => {
            try {
                const res = await fetch('https://chat.quanteqsolutions.com/api/users', {
                    headers: {
                        'Authorization': localStorage.getItem('token')
                    }
                });
                const data = await res.json();

                if (data.status) {
                    const allUsers = data.users;
                    const filteredUsers = allUsers.filter(user => user._id !== loggedInUser._id);
                    setUsers(filteredUsers || []);
                } else {
                    toast.error(data.message || 'error!');
                }
                setLoading(false);
            } catch (err) {
                console.error(err);
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    // Toggle hidden user
    const toggleHidden = (userId) => {
        setHiddenUsers(prev =>
            prev.includes(userId)
                ? prev.filter(id => id !== userId)
                : [...prev, userId]
        );
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!groupName || selectedUsers.length === 0) {
            toast.info('Enter valid group details');
            return;
        }

        if (!selectedCompany) {
            toast.info('Select a company');
            return;
        }

        try {
            const response = await fetch('https://chat.quanteqsolutions.com/api/groups/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({
                    name: groupName,
                    members: selectedUsers.map(u => u._id), // send ids
                    hiddenMembers: hiddenUsers,              // send hidden ids
                    company: selectedCompany
                })
            });

            const data = await response.json();
            if (data.status) {
                navigate(`/dashboard/chat?group=${data.group._id}`)
            } else {
                toast.error(data.message || 'error!');
            }
        } catch (err) {
            console.error(err);
            toast.error('Error creating group');
        }
    };

    const hiddenDepartments = ["Operations Team", "Quality Team", "Accounts Team", "management"];

    return (
        <div className="nk-chat-body profile-shown pe-0">
            <div className="nk-chat-head group-create-form">
                <Form className='w-100' onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder='Group Name'
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            required
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Control
                            as="select"
                            value={selectedCompany}
                            onChange={(e) => setSelectedCompany(e.target.value)}
                            required
                        >
                            <option value="">Select company</option>
                            {companies.map((company) => (
                                <option key={company._id} value={company?._id}>
                                    {company?.companyName} ({company?.companyCode})
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>

                    {selectedCompany && (
                        <Form.Group className="mb-3">
                            {loading ? (
                                <Spinner animation="border" />
                            ) : (
                                <Multiselect
                                    options={users
                                        .filter((u) => {
                                            if (hiddenDepartments.includes(u?.department)) {
                                                return true; // ✅ always include hidden dept users
                                            }
                                            return u?.company === selectedCompany; // ✅ filter others by company
                                        })
                                        .map((u) => ({
                                            ...u,
                                            displayName: `${u?.name} (${u?.department || "No Dept"})`, // 👈 add department
                                        }))}
                                    selectedValues={selectedUsers.map((u) => ({
                                        ...u,
                                        displayName: `${u?.name} (${u?.department || "No Dept"})`,
                                    }))}
                                    onSelect={(selectedList) => setSelectedUsers(selectedList)}
                                    onRemove={(selectedList) => {
                                        setSelectedUsers(selectedList);
                                        // also remove from hidden if unselected
                                        setHiddenUsers((prev) =>
                                            prev.filter((id) => selectedList.find((u) => u._id === id))
                                        );
                                    }}
                                    displayValue="displayName" // 👈 use displayName instead of name
                                    placeholder="Enter name"
                                />
                            )}
                        </Form.Group>
                    )}

                    {/* Hidden user toggles */}
                    {selectedUsers.length > 0 && (
                        <div className="mb-3 px-2" style={{ maxHeight: '60vh', overflowX: 'auto' }}>
                            <h6>Mark Hidden Users:</h6>
                            {selectedUsers.map(user => (
                                <Form.Check
                                    key={user._id}
                                    type="checkbox"
                                    label={`Hide ${user.name}`}
                                    checked={hiddenUsers.includes(user._id)}
                                    onChange={() => toggleHidden(user._id)}
                                />
                            ))}
                        </div>
                    )}

                    <Button type="submit">Create Group</Button>
                </Form>
            </div>
        </div>
    )
}

export default CreateGroup2
