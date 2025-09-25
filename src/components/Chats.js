import React, { useEffect, useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useOnlineUsers } from '../context-api/OnlineUsersContext';
import socket from '../utils/socket';
import notificationSound from '../assets/sounds/notification_sound.wav'

import parse, { domToReact } from "html-react-parser";
import ConfirmModal from './ConfirmModal';

const Chats = () => {
    const onlineUsers = useOnlineUsers();
    const location = useLocation();
    const navigate = useNavigate();
    const queryParams = new URLSearchParams(location.search);
    const [userData, setUserData] = useState()

    const selectedUserId = queryParams.get('user');
    const selectedGroupId = queryParams.get('group');
    const hasGroup = queryParams.has('group');

    const [groupEnable, setGroupEnable] = useState(hasGroup ? true : false)
    const [groups, setGroups] = useState([])

    const [users, setUsers] = useState([]);
    const [unreadUsers, setUnreadUsers] = useState(0);
    const [unreadGroups, setUnreadGroups] = useState(0);

    const loggedInUser = JSON.parse(localStorage.getItem('userData'))

    // useEffect(() => {
    //     if (selectedGroupId) {
    //         setGroupEnable(true);
    //     }
    //     else {
    //         setGroupEnable(false);
    //     }
    // }, [selectedUserId, selectedGroupId])

    useEffect(() => {
        if (hasGroup) {
            setGroupEnable(true);
        }
        else {
            setGroupEnable(false);
        }
    }, [hasGroup])


    const getUser = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`https://chat.quanteqsolutions.com/api/auth/get-user`, {
                headers: {
                    "Authorization": token
                }
            });
            const data = await response.json();
            console.log("auth_data", data);
            if (data.status) {
                setUserData(data.userData);
            }
            else {
                // toast.error(data.message || 'error!');
            }
        }
        catch (error) {
            console.error(error);
        }
    }



    // Fetch list of users
    const fetchGroups = async () => {
        try {
            const res = await fetch('https://chat.quanteqsolutions.com/api/groups/my_groups', {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            const data = await res.json();
            if (data.status) {

                const allGroups = data.groups;

                setGroups(allGroups || []);

                const unreadGroups = allGroups.filter(user => user.unseenCount > 0);

                // Example: If you want to store only the count:
                setUnreadGroups(unreadGroups.length);
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

    const fetchUsers = async () => {
        try {
            const res = await fetch('https://chat.quanteqsolutions.com/api/messages/chatUsers', {
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            const data = await res.json();

            if (data.status) {
                const allUsers = data.users;

                console.log('login users,', allUsers)

                setUsers(allUsers || []);

                const unreadUsers = allUsers.filter(user => user.unreadCount > 0);

                // Example: If you want to store only the count:
                setUnreadUsers(unreadUsers.length);
                // setUnreadUsers(unreadUsersCount)

                // setLoading(false);
            }
            else {
                // toast.error(data.message || 'error!');
            }

        } catch (err) {
            console.error(err);
            // setLoading(false);
        }
    };


    const markSeen = async () => {
        try {
            const res = await fetch('https://chat.quanteqsolutions.com/api/messages/markSeen', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({ senderId: selectedUserId })
            });
            const data = await res.json();

            if (data.status) {
                console.log(data.message);
            }
            else {
                // toast.error(data.message || 'error!');
            }

        } catch (err) {
            console.error(err);
            // setLoading(false);
        }
    }


    useEffect(() => {
        const audio = new Audio(notificationSound);
        socket.on('notification', ({ message }) => {
            fetchUsers();
            fetchGroups();

            console.log('mef', message)
            console.log('test', message?.receiverId, loggedInUser?._id)
            if (message?.receiverId === loggedInUser?._id) {
                console.log('test', message?.receiverId, loggedInUser?._id)
                audio.play().catch(error => {
                    console.error('Failed to play sound:', error);
                });
            }
            else {
                const isMember = message?.groupDetails?.members?.some(
                    memberId => memberId === loggedInUser?._id
                );

                if (isMember && message?.senderDetails?.id !== loggedInUser?._id) {
                    audio.play().catch(error => {
                        console.error('Failed to play sound:', error);
                    });
                }
            }
        })
    }, [])


    useEffect(() => {
        if (selectedUserId) {
            markSeen();
        }
        fetchUsers();
        fetchGroups();
        getUser();
    }, [selectedUserId, selectedGroupId]);



    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState(null);


    const showRemoveModal = (groupId) => {
        setSelectedMessages(groupId);
        setConfirmModalVisible(true);
    };

    const hideModal = () => {
        setConfirmModalVisible(false);
        setSelectedMessages(null);
    };

    const handleDelete = async (groupId) => {
        if (!loggedInUser?.groupCreateAccess && loggedInUser?.role !== 1) {
            toast.error("You don't have access")
            return;
        }

        try {
            const res = await fetch(`https://chat.quanteqsolutions.com/api/groups/delete/${selectedMessages}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': localStorage.getItem('token')
                }
            });
            const data = await res.json();

            if (data.status) {
                toast.success(data.message || 'group deleted');
                fetchGroups();
                navigate('/dashboard/chat?group')
            }
            else {
                toast.error(data.message || 'error!');
            }

        } catch (err) {
            console.error(err);
            // setLoading(false);
        }

        hideModal();
    }

    const handleChangeGroup = () => {
        navigate(`/dashboard/chat?group`)
    }
    const handleChangeUser = () => {
        navigate(`/dashboard/chat?chats`)
    }

    const truncateHtml = (html, limit) => {
        // Convert line breaks and </div> into spaces
        let clean = html
            .replace(/\n/g, " ")
            .replace(/<\/div>/gi, " ");

        // Remove markdown-like symbols (*, _, //)
        clean = clean
            .replace(/\*+/g, "")   // remove *
            .replace(/_+/g, "")    // remove _
            .replace(/\/{2}/g, ""); // remove //

        // Strip HTML tags to plain text
        const tempElement = document.createElement("div");
        tempElement.innerHTML = clean;
        const text = tempElement.textContent || tempElement.innerText || "";

        // Truncate
        let truncatedText = text;
        if (text.length > limit) {
            truncatedText = text.substring(0, limit) + "...";
        }

        return truncatedText;
    };

    return (
        <div className="nk-chat-aside">
            <div className="nk-chat-aside-head">
                <div className="nk-chat-aside-user">
                    <div className="dropdown">
                        {/* <a href="#" className="dropdown-toggle dropdown-indicator" data-bs-toggle="dropdown"> */}
                        {/* <div className="user-avatar">
                                <img src="./images/avatar/b-sm.jpg" alt="" />
                            </div> */}
                        <div className="title">Chats</div>
                        {/* </a> */}
                        <div className="dropdown-menu">
                            <ul className="link-list-opt no-bdr">
                                <li><a href="html/apps/chats-contacts.html"><span>Contacts</span></a></li>
                                <li><a href="html/apps/chats-channels.html"><span>Channels</span></a></li>
                                <li className="divider"></li>
                                <li><a href="#"><span>Help</span></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <ul className="nk-chat-aside-tools g-2">
                    {/* <li>
                        <div className="dropdown">
                            <a href="#" className="btn btn-round btn-icon btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <em className="icon ni ni-setting-alt-fill"></em>
                            </a>
                            <div className="dropdown-menu dropdown-menu-end">
                                <ul className="link-list-opt no-bdr">
                                    <li><a href="#"><span>Settings</span></a></li>
                                    <li className="divider"></li>
                                    <li><a href="#"><span>Message Requests</span></a></li>
                                    <li><a href="#"><span>Archives Chats</span></a></li>
                                    <li><a href="#"><span>Unread Chats</span></a></li>
                                    <li><a href="#"><span>Group Chats</span></a></li>
                                </ul>
                            </div>
                        </div>
                    </li> */}
                    {(userData?.role == 1 || userData?.groupCreateAccess || userData?.oneOnOneAccess) && <li>
                        <div className="dropdown">
                            <a href="#" className="btn btn-round btn-icon btn-light dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                <em className="icon ni ni-edit-alt-fill"></em>
                            </a>
                            <div className="dropdown-menu dropdown-menu-start">
                                <ul className="link-list-opt no-bdr">
                                    {(userData?.groupCreateAccess || userData?.role == 1) && <li><Link to="/dashboard/chat?create_group"><span>Create Group</span></Link></li>}
                                    {(userData?.oneOnOneAccess || userData?.role == 1) && <li><Link to="/dashboard/chat?new_chat"><span>New Chat</span></Link></li>}
                                    {(userData?.role == 1) && <li><Link to="/dashboard/chat?add_user"><span>Add User</span></Link></li>}
                                    {(userData?.role == 1) && <li><Link to="/dashboard/chat?add_company"><span>Add Company</span></Link></li>}
                                </ul>
                            </div>
                        </div>
                    </li>}
                    {/* <li>
                        <div class="dropdown">
                            <a href="#" class="btn btn-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
                                Dropdown button
                            </a>
                            <ul class="dropdown-menu">
                                <li><a class="dropdown-item" href="#">Action</a></li>
                                <li><a class="dropdown-item" href="#">Another action</a></li>
                                <li><a class="dropdown-item" href="#">Something else here</a></li>
                            </ul>
                        </div>
                    </li> */}
                </ul>
            </div>
            <div className="nk-chat-aside-body" data-simplebar>
                <div className="nk-chat-aside-search">
                    {/* <div className="form-group">
                        <div className="form-control-wrap">
                            <div className="form-icon form-icon-left">
                                <em className="icon ni ni-search"></em>
                            </div>
                            <input type="text" className="form-control form-round" id="default-03" placeholder="Search by name" />
                        </div>
                    </div> */}

                    <div className="select-chat">
                        <ul className='d-flex'>
                            <li className={`disabled position-relative ${!groupEnable ? 'active' : ''}`} onClick={handleChangeUser}>
                                Chats
                                {unreadUsers > 0 && <span className="unread-users">{unreadUsers}</span>}
                            </li>
                            <li className={`${groupEnable ? 'active' : ''}`} onClick={handleChangeGroup}>
                                Groups
                                {unreadGroups > 0 && <span className="unread-users">{unreadGroups}</span>}
                            </li>
                        </ul>
                    </div>
                </div>



                {/* <div className="nk-chat-aside-panel nk-chat-fav">
                                            <h6 className="title overline-title-alt">Favorites</h6>
                                            <ul className="fav-list">
                                                <li>
                                                    <a href="#" className="btn btn-lg btn-icon btn-outline-light btn-white btn-round">
                                                        <em className="icon ni ni-plus"></em>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <div className="user-avatar">
                                                            <img src="./images/avatar/b-sm.jpg" alt="" />
                                                            <span className="status dot dot-lg dot-success"></span>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <div className="user-avatar">
                                                            <span>AB</span>
                                                            <span className="status dot dot-lg dot-success"></span>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <div className="user-avatar bg-pink">
                                                            <span>KH</span>
                                                            <span className="status dot dot-lg dot-success"></span>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <div className="user-avatar bg-purple">
                                                            <span>VB</span>
                                                            <span className="status dot dot-lg dot-success"></span>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <div className="user-avatar">
                                                            <img src="./images/avatar/a-sm.jpg" alt="" />
                                                            <span className="status dot dot-lg dot-success"></span>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <div className="user-avatar">
                                                            <img src="./images/avatar/c-sm.jpg" alt="" />
                                                            <span className="status dot dot-lg dot-success"></span>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <div className="user-avatar">
                                                            <img src="./images/avatar/d-sm.jpg" alt="" />
                                                            <span className="status dot dot-lg dot-success"></span>
                                                        </div>
                                                    </a>
                                                </li>
                                                <li>
                                                    <a href="#">
                                                        <div className="user-avatar bg-info">
                                                            <span>SK</span>
                                                            <span className="status dot dot-lg dot-success"></span>
                                                        </div>
                                                    </a>
                                                </li>
                                            </ul>
                                        </div> */}

                <div className="nk-chat-list">
                    <h6 className="title overline-title-alt">Messages</h6>
                    {groupEnable ? (
                        <ul className="chat-list">
                            {groups.length === 0 ? (
                                <div className='d-flex justify-content-center mt-4'>Not added in any group yet</div>
                            ) : (
                                groups.map((group, index) => (
                                    <li key={index} className={`chat-item ${selectedGroupId === group._id ? 'active' : ''} ${group?.unseenCount > 0 ? 'is-unread' : ''}`}>
                                        <Link className="chat-link chat-open current" to={`/dashboard/chat?group=${group._id}`}>

                                            {group?.groupImage ? (
                                                <div className="chat-media user-avatar bg-purple group-image" style={{ backgroundImage: `url(https://chat.quanteqsolutions.com/${group?.groupImage})` }}
                                                ></div>
                                            ) : (
                                                <div className="chat-media user-avatar bg-purple"
                                                >
                                                    <span>{group?.name?.slice(0, 2).toUpperCase()}</span>
                                                    {/* <span className={`status dot dot-lg ${onlineUsers[group._id] ? 'dot-success' : 'dot-gray'} `}></span> */}
                                                </div>
                                            )}
                                            <div className="chat-info">
                                                <div className="chat-from">
                                                    <div className="name">{group?.name}</div>
                                                    <span className="time">{group?.latestTimestamp}</span>
                                                </div>
                                                {<div className="chat-context">
                                                    {group?.latestSenderId && <div className="text">{group?.latestSenderId === loggedInUser?._id ? 'you :' : `${group?.latestSenderName} :`} {parse(truncateHtml(group?.latestMessage || "", 20))}</div>}
                                                    {group?.unseenCount > 0 && <div className="status unread">{group?.unseenCount}</div>}
                                                    {/* <div className="status delivered">
                                                        <em className="icon ni ni-check-circle-fill"></em>
                                                    </div> */}
                                                </div>}
                                            </div>
                                        </Link>
                                        <div className="chat-actions">
                                            <div className="dropdown">
                                                <a href="#" className="btn btn-icon btn-sm btn-trigger dropdown-toggle" data-bs-toggle="dropdown"><em className="icon ni ni-more-h"></em></a>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    <ul className="link-list-opt no-bdr">
                                                        <li><button className='btn' onClick={() => showRemoveModal(group?._id)}>Delete Group</button></li>
                                                        {/* <li><a href="#">Hide Conversion</a></li>
                                                        <li><a href="#">Delete Conversion</a></li>
                                                        <li className="divider"></li>
                                                        <li><a href="#">Mark as Unread</a></li>
                                                        <li><a href="#">Ignore Messages</a></li>
                                                        <li><a href="#">Block Messages</a></li> */}
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))
                            )}
                        </ul>
                    ) : (
                        <ul className="chat-list">
                            {users.length === 0 ? (
                                <div className='d-flex justify-content-center mt-4'>No chat started yet</div>
                            ) : (
                                users.map((user, index) => (
                                    <li key={index} className={`chat-item ${selectedUserId === user._id ? 'active' : ''} ${user?.unreadCount > 0 ? 'is-unread' : ''}`}>
                                        <Link className="chat-link chat-open current" to={`/dashboard/chat?user=${user._id}`}>
                                            <div className="chat-media user-avatar bg-purple" style={{ backgroundImage: `url(https://chat.quanteqsolutions.com${user?.imagePath})` }}>
                                                {!user?.imagePath && <span>{user?.name?.slice(0, 2).toUpperCase()}</span>}
                                                <span className={`status dot dot-lg ${onlineUsers[user._id] ? 'dot-success' : 'dot-gray'} `}></span>
                                            </div>
                                            <div className="chat-info">
                                                <div className="chat-from">
                                                    <div className="name">{user?.name}</div>
                                                    <span className="time">{user?.latestTimestamp}</span>
                                                </div>
                                                <div className="chat-context">
                                                    <div className="text">{user?.latestSenderId === loggedInUser?._id ? 'you :' : ''} {parse(truncateHtml(user?.latestMessage || "", 20))}</div>
                                                    {user?.unreadCount > 0 && <div className="status unread">{user?.unreadCount}</div>}
                                                    {/* <div className="status delivered">
                                                        <em className="icon ni ni-check-circle-fill"></em>
                                                    </div> */}
                                                </div>
                                            </div>
                                        </Link>
                                        {/* <div className="chat-actions">
                                            <div className="dropdown">
                                                <a href="#" className="btn btn-icon btn-sm btn-trigger dropdown-toggle" data-bs-toggle="dropdown"><em className="icon ni ni-more-h"></em></a>
                                                <div className="dropdown-menu dropdown-menu-right">
                                                    <ul className="link-list-opt no-bdr">
                                                        <li><a href="#">Mute Conversion</a></li>
                                                        <li><a href="#">Hide Conversion</a></li>
                                                        <li><a href="#">Delete Conversion</a></li>
                                                        <li className="divider"></li>
                                                        <li><a href="#">Mark as Unread</a></li>
                                                        <li><a href="#">Ignore Messages</a></li>
                                                        <li><a href="#">Block Messages</a></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div> */}
                                    </li>
                                ))
                            )}
                        </ul>
                    )
                    }
                </div>
            </div>

            <ConfirmModal
                show={confirmModalVisible}
                handleClose={hideModal}
                onConfirm={handleDelete}
                title="Confirm Group Delete"
                message="Are you sure you want to delete this Group?"
            />
        </div>
    )
}

export default Chats
