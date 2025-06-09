import React, { useState, useEffect, useRef } from 'react';
import { Form, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const NewChat = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [loading, setLoading] = useState(true);
    const [dropdownVisible, setDropdownVisible] = useState(false);

    const loggedInUser = JSON.parse(localStorage.getItem('userData'));
    const dropdownRef = useRef();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await fetch('https://chat.quanteqsolutions.com/api/users', {
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                    },
                });
                const data = await res.json();

                if (data.status) {
                    const allUsers = data.users;
                    const filteredUsers = allUsers.filter((user) => user._id !== loggedInUser._id);
                    setUsers(filteredUsers || []);
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

        fetchUsers();
    }, []);

    const handleSelectUser = (userId) => {
        navigate(`/dashboard/chat?user=${userId}`);
    };

    const handleFocus = () => {
        setDropdownVisible(true);
    };

    const handleBlur = (e) => {
        // Add slight delay to allow click event on dropdown to fire
        setTimeout(() => {
            setDropdownVisible(false);
        }, 200);
    };

    const filteredUsers = users.filter((user) => {
        const searchLower = searchTerm.toLowerCase();
        return (
            user.name.toLowerCase().includes(searchLower) ||
            user.email.toLowerCase().includes(searchLower)
        );
    });

    return (
        <div className="nk-chat-body profile-shown pe-0">
            <div className="nk-chat-head border-0 nk-chat-aside-search">
                <Form className="w-100" autoComplete="off">
                    <Form.Group className="mb-3 position-relative">
                        {/* <div className="form-control-wrap"> */}
                        <div className="form-icon form-icon-left">
                            <em className="icon ni ni-search"></em>
                        </div>
                        {/* <input type="text" className="form-control form-round" id="default-03" placeholder="Search by name" />
                        </div> */}
                        <Form.Control
                            type="text"
                            placeholder="Search by name or email"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            onFocus={handleFocus}
                            onBlur={handleBlur}
                            className='form-round'
                        />
                        {dropdownVisible && (
                            <div
                                ref={dropdownRef}
                                style={{
                                    position: 'absolute',
                                    top: '100%',
                                    left: 0,
                                    right: 0,
                                    background: '#fff',
                                    border: '1px solid #ccc',
                                    zIndex: 10,
                                    maxHeight: '200px',
                                    overflowY: 'auto',
                                }}
                            >
                                {loading ? (
                                    <div className="p-2 text-center">
                                        <Spinner animation="border" size="sm" /> Loading...
                                    </div>
                                ) : filteredUsers.length > 0 ? (
                                    filteredUsers.map((user) => (
                                        <div
                                            key={user._id}
                                            style={{
                                                padding: '8px 12px',
                                                cursor: 'pointer',
                                                borderBottom: '1px solid #eee',
                                            }}
                                            onMouseDown={() => handleSelectUser(user._id)} // onMouseDown to avoid blur before click
                                        >
                                            {user.name}
                                        </div>
                                    ))
                                ) : (
                                    <div className="p-2 text-center">No users found</div>
                                )}
                            </div>
                        )}
                    </Form.Group>
                </Form>
            </div>
        </div>
    );
};

export default NewChat;
