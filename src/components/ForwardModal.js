import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { toast } from 'react-toastify';
import socket from '../utils/socket';

const ForwardModal = ({ show, handleClose, onlineUsers, getPrivateRoomId, user, selectedMessages, setSelectedMessages }) => {
    const [selectedMembers, setSelectedMembers] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [users, setUsers] = useState([]);

    const [unreadUsers, setUnreadUsers] = useState(0);

    const [activeTab, setActiveTab] = useState('chats');

    const [selectedIds, setSelectedIds] = useState([]);
    const [selectedUsers, setSelectedUsers] = useState([]);


    const fetchUsers = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://chat.quanteqsolutions.com/api/messages/chatUsers', {
                headers: {
                    Authorization: token,
                },
            });
            const data = await res.json();
            console.log(data, token);

            if (data.status) {
                let allUsers = data.users;
                allUsers.forEach(element => {
                    element.roomId = getPrivateRoomId(user?._id, element?._id)
                });
                setUsers(allUsers || []);
                const unreadUsers = data.users.filter(user => user.unreadCount > 0);
                setUnreadUsers(unreadUsers.length);

            }
        } catch (err) {
            console.error(err);
        } finally {
            // setLoading(false);
        }
    };

    const fetchGroups = async () => {
        try {
            const token = localStorage.getItem('token');
            const res = await fetch('https://chat.quanteqsolutions.com/api/groups/my_groups', {
                headers: {
                    'Authorization': token
                }
            });
            const data = await res.json();
            console.log(data)
            if (data.status) {

                const allGroups = data.groups;

                // setGroups(allGroups || []);

                // const unreadGroups = allGroups.filter(user => user.unseenCount > 0);

                // Example: If you want to store only the count:
                // setUnreadGroups(unreadGroups.length);
            }
            else {
                // toast.error(data.message || 'error!');
            }
            // setLoading(false);
        } catch (err) {
            console.error(err);
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
        fetchGroups();

        // socket.on('notification', ({ message }) => {
        //     fetchUsers();
        //     fetchGroups();
        // })

        // socket.on('seen-notification', (data) => {
        //     fetchUsers();
        //     fetchGroups();
        // })

        // return () => {
        //     socket.off('notification');
        //     socket.off('seen-notification');
        // };
    }, [activeTab])

    // Handle individual checkbox
    const handleCheckboxChange = (roomId, item) => {
        // setSelectedMembers((prevSelected) =>
        //     prevSelected.includes(userId)
        //         ? prevSelected.filter((id) => id !== userId)
        //         : [...prevSelected, userId]
        // );

        setSelectedUsers((prevSelected) => {
            if (prevSelected.includes(roomId)) {
                // Unselect if already selected
                return prevSelected.filter(id => id !== roomId);
            } else {
                // Select if not already selected
                return [...prevSelected, roomId];
            }
        });

        setSelectedIds(prev => {
            // Check if already selected by ID
            const isAlreadySelected = prev.some(msg => msg._id === item._id);

            return isAlreadySelected
                ? prev.filter(msg => msg._id !== item._id) // Remove if exists
                : [...prev, item]; // Add full item object
        });
    };

    // Handle "Select All" checkbox
    const handleSelectAll = () => {
        if (selectAll) {
            setSelectedMembers([]);
        } else {
            const allUserIds = users.map((user) => user._id);
            setSelectedMembers(allUserIds);
        }
        setSelectAll(!selectAll);
    };

    // Keep selectAll checkbox in sync
    useEffect(() => {
        if (selectedMembers.length === users.length && users.length > 0) {
            setSelectAll(true);
        } else {
            setSelectAll(false);
        }
    }, [selectedMembers, users]);

    const handleSubmit = () => {
        console.log(selectedIds, user, selectedMessages)

        selectedIds.forEach(selectedeUser => {
            if (!selectedeUser?.members) {
                socket.emit('send-forward-message', { room: selectedeUser.roomId, senderId: user._id, receiverId: selectedeUser._id, incomingMessages: selectedMessages });
            }
            else {
                socket.emit('send-forward-message', { room: selectedeUser._id, senderId: user._id, groupId: selectedeUser._id, incomingMessages: selectedMessages });
            }
        });
        setSelectedMessages([]);
        setSelectedIds([]);
        setSelectedUsers([])
        handleClose();

        // Toast.show({
        //     type: 'success',
        //     text1: 'success',
        //     text2: 'sending messages...',
        //     visibilityTime: 3000,
        //     position: 'bottom',
        //     bottomOffset: 100
        // });
    }

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Forwards to...</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>

                    <div className='position-relative'>
                        {/* <Form.Check
                            type="checkbox"
                            checked={selectAll}
                            label="Select All"
                            onChange={handleSelectAll}
                            
                        /> */}
                        {/* <div className="form-icon form-icon-left ms-3">
                            <em className="icon ni ni-search"></em>
                        </div>
                        <Form.Control
                            type="text"
                            placeholder="Search by name or email"
                            className='form-round ms-3'
                        /> */}
                    </div>

                    <ul className='chat-list'>
                        {users.map((user) => (
                            <li key={user._id} className="chat-item">
                                <div className="chat-link chat-open current">
                                    <div className="checkbox">
                                        <Form.Check
                                            type="checkbox"
                                            className="add-member-checkbox"
                                            checked={selectedUsers.includes(user.roomId)}
                                            onChange={() => handleCheckboxChange(user.roomId, user)}
                                        />
                                    </div>
                                    <div className="chat-media user-avatar bg-purple" style={{ backgroundImage: `url(https://chat.quanteqsolutions.com/${user?.imagePath})` }}>
                                        {!user?.imagePath && <span>{user?.name?.slice(0, 2).toUpperCase()}</span>}
                                        <span className={`status dot dot-lg ${onlineUsers[user._id] ? 'dot-success' : 'dot-gray'}`}></span>
                                    </div>
                                     
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Cancel
                </Button>
                <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={selectedUsers.length === 0}
                >
                    send
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ForwardModal;
