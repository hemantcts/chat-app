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
    const [hiddenUsers, setHiddenUsers] = useState([]); // 👈 track hidden
    const [loading, setLoading] = useState(true);

    const loggedInUser = JSON.parse(localStorage.getItem('userData'))

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
                    hiddenMembers: hiddenUsers              // send hidden ids
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
                        {loading ? (
                            <Spinner animation="border" />
                        ) : (
                            <Multiselect
                                options={users}
                                selectedValues={selectedUsers}
                                onSelect={(selectedList) => setSelectedUsers(selectedList)}
                                onRemove={(selectedList) => {
                                    setSelectedUsers(selectedList);
                                    // also remove from hidden if unselected
                                    setHiddenUsers(prev => prev.filter(id => selectedList.find(u => u._id === id)));
                                }}
                                displayValue="name"
                                placeholder='Enter name'
                            />
                        )}
                    </Form.Group>

                    {/* Hidden user toggles */}
                    {selectedUsers.length > 0 && (
                        <div className="mb-3 px-2" style={{maxHeight: '60vh', overflowX: 'auto'}}>
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
