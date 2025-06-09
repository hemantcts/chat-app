import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const InfoBar = ({ showDetails, setShowDetails, groupDetails, groupName, setGroupName, getGroupDetails, onlineUsers }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [isNameChanged, setIsNameChanged] = useState(false);
    const [users, setUsers] = useState([])
    const [selectedMembers, setSelectedMembers] = useState([])


    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleChange = (e) => {
        setGroupName(e.target.value);
        setIsNameChanged(true);
    };

    const handleBlur = () => {
        if (isNameChanged) {
            onSave(groupName); // Save to parent or backend
            setIsNameChanged(false)
        }
        setIsEditing(false);
    };

    const onSave = async (newName) => {

        const response = await fetch(`https://chat.quanteqsolutions.com/api/groups/update-name`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: localStorage.getItem('token')
            },
            body: JSON.stringify({ groupId: groupDetails._id, name: newName })
        });
        const data = await response.json();

        if (data.status) {
            getGroupDetails()
            toast.success(data.message);
        }
        else {
            toast.error(data.message);
        }

    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.target.blur();
        }
    };

    const loggedInUser = JSON.parse(localStorage.getItem('userData'))



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

                console.log('login users,', allUsers)

                const members = groupDetails?.members?.map(member => member._id); // extract IDs

                const filteredUsers = allUsers.filter(user => !members.includes(user._id));
                console.log(members, groupDetails, filteredUsers)

                setUsers(filteredUsers || []);

                // setLoading(false);
            }
            else {
                toast.error(data.message || 'error!');
            }

        } catch (err) {
            console.error(err);
            // setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [groupDetails]);

    const addMembers = async (selectedMembers) => {
        let members = [];

        if (selectedMembers) {
            if (Array.isArray(selectedMembers)) {
                members = selectedMembers;
            } else {
                members.push(selectedMembers);
            }
        }
        try {
            const res = await fetch('https://chat.quanteqsolutions.com/api/groups/add-members', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({ groupId: groupDetails._id, members })
            });
            const data = await res.json();

            if (data.status) {
                toast.success(data.message || 'member added!');
                getGroupDetails();

                const allUsers = users;
                const filteredUsers = allUsers.filter(user => !members.includes(user._id));
                // fetchUsers();
                setUsers(filteredUsers);
            }
            else {
                toast.error(data.message || 'error!');
            }

        } catch (err) {
            console.error(err);
            // setLoading(false);
        }
    }

    const removeMembers = async (member) => {
        let arr = [];
        arr.push(member);
        try {
            const res = await fetch('https://chat.quanteqsolutions.com/api/groups/remove-members', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem('token')
                },
                body: JSON.stringify({ groupId: groupDetails._id, members: arr })
            });
            const data = await res.json();

            if (data.status) {
                toast.error(data.message || 'member removed!');
                getGroupDetails();
            }
            else {
                toast.error(data.message || 'error!');
            }

        } catch (err) {
            console.error(err);
            // setLoading(false);
        }
    }

    const handleRouteClick = () =>{
        setShowDetails(false)
    }

    return (
        <div className={`nk-chat-profile ${showDetails ? 'visible' : ''}`} data-simplebar>
            <div className="user-card user-card-s2 my-4">
                <div className="user-avatar md bg-purple">
                    <span>{groupDetails?.name?.slice(0, 2).toUpperCase()}</span>
                </div>
                <div className="user-info position-relative">
                    {isEditing ? (
                        <input
                            type="text"
                            value={groupName}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            onKeyDown={handleKeyDown}
                            autoFocus
                        />
                    ) : (
                        <>
                            <h5 className='me-1' style={{ display: 'inline-block' }}>{groupName}</h5>
                            <em
                                onClick={handleEditClick}
                                className="icon ni ni-edit-alt-fill"
                                style={{ cursor: 'pointer' }}
                                title="Edit group name"
                            ></em>
                        </>
                    )}
                    {/* <h5 style={{ display: 'inline-block' }}>{groupName}</h5> <em onClick={handleChangeName} className="icon ni ni-edit-alt-fill" style={{ cursor: 'pointer' }}></em> */}
                    <span className="sub-text">
                        <button className='btn ' onClick={() => { setShowMembers(!showMembers) }}>
                            Total Members : {groupDetails?.members?.length}
                        </button>
                    </span>

                    {showMembers && <div className="members-list">
                        <span className="sub-text justify-content-start">Group Members : {groupDetails?.members?.length} </span>
                        <ul className={`chat-list ${users.length === 0 ? 'border-0' : ''}`} style={{ borderBottom: '2px solid #8094ae' }}>
                            {groupDetails?.members?.map((group, index) => (
                                <li key={index} className={`chat-item`}>
                                    <div className="chat-link chat-open current" >
                                        <div className="chat-media user-avatar bg-purple">
                                            <span>{group?.name?.slice(0, 2).toUpperCase()}</span>
                                            <span className={`status dot dot-lg ${onlineUsers[group._id] ? 'dot-success' : 'dot-gray'} `}></span>
                                        </div>
                                        <div className="chat-info">
                                            <div className="chat-from">
                                                <div className="name">{group?.name}</div>
                                                <span className="time">Now</span>
                                            </div>
                                            <div className="chat-context">
                                                <div className="text">need to work here</div>
                                                <div className="status delivered">
                                                    <em className="icon ni ni-check-circle-fill"></em>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    {(group?._id !== loggedInUser?._id ) && <div className="chat-actions">
                                        <div className="dropdown">
                                            <a href="#" className="btn btn-icon btn-sm btn-trigger dropdown-toggle" data-bs-toggle="dropdown"><em className="icon ni ni-more-h"></em></a>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                <ul className="link-list-opt no-bdr">
                                                    {loggedInUser?.role === 1 && <li><a href="#" onClick={() => removeMembers(group._id)}>Remove Member</a></li>}
                                                    <li><Link to={`/dashboard/chat?user=${group._id}`} onClick={handleRouteClick}>Start Chat</Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>}
                                </li>
                            ))}
                        </ul>

                        {users.length > 0 && <span className="sub-text justify-content-start mt-1">Add New Members 
                            {/* {users?.length}  */}
                            </span>}

                        <ul className='chat-list'>
                            {users.map((group, index) => (
                                <li key={index} className={`chat-item`}>
                                    <div className="chat-link chat-open current" >
                                        <div className="chat-media user-avatar bg-purple">
                                            <span>{group?.name?.slice(0, 2).toUpperCase()}</span>
                                            <span className={`status dot dot-lg ${onlineUsers[group._id] ? 'dot-success' : 'dot-gray'} `}></span>
                                        </div>
                                        <div className="chat-info">
                                            <div className="chat-from">
                                                <div className="name">{group?.name}</div>
                                                <span className="time">Now</span>
                                            </div>
                                            <div className="chat-context">
                                                <div className="text">need to work here</div>
                                                <div className="status delivered">
                                                    <em className="icon ni ni-check-circle-fill"></em>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="chat-actions">
                                        <div className="dropdown">
                                            <a href="#" className="btn btn-icon btn-sm btn-trigger dropdown-toggle" data-bs-toggle="dropdown"><em className="icon ni ni-more-h"></em></a>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                <ul className="link-list-opt no-bdr">
                                                    {loggedInUser?.role === 1 && <li><a href='#' onClick={() => addMembers(group._id)}>Add Member</a></li>}
                                                    <li><Link to={`/dashboard/chat?user=${group._id}`} onClick={handleRouteClick}>Start Chat</Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>}
                </div>
                <div className="user-card-menu dropdown">
                    <a href="#" className="btn btn-icon btn-sm btn-trigger dropdown-toggle" data-bs-toggle="dropdown"><em className="icon ni ni-more-h"></em></a>
                    <div className="dropdown-menu dropdown-menu-right">
                        <ul className="link-list-opt no-bdr">
                            <li><a href="#"><em className="icon ni ni-eye"></em><span>View Profile</span></a></li>
                            <li><a href="#"><em className="icon ni ni-na"></em><span>Block Messages</span></a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="chat-profile">
                <div className="chat-profile-group">
                    <a href="#" className="chat-profile-head" data-bs-toggle="collapse" data-bs-target="#chat-options">
                        <h6 className="title overline-title">Options</h6>
                        <span className="indicator-icon"><em className="icon ni ni-chevron-down"></em></span>
                    </a>
                    <div className="chat-profile-body collapse show" id="chat-options">
                        <div className="chat-profile-body-inner">
                            <ul className="chat-profile-options">
                                <li><a className="chat-option-link" href="#"><em className="icon icon-circle bg-light ni ni-edit-alt"></em><span className="lead-text">Nickname</span></a></li>
                                <li><a className="chat-option-link chat-search-toggle" href="#"><em className="icon icon-circle bg-light ni ni-search"></em><span className="lead-text">Search In Conversation</span></a></li>
                                <li><a className="chat-option-link" href="#"><em className="icon icon-circle bg-light ni ni-circle-fill"></em><span className="lead-text">Change Theme</span></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="chat-profile-group">
                    <a href="#" className="chat-profile-head" data-bs-toggle="collapse" data-bs-target="#chat-settings">
                        <h6 className="title overline-title">Settings</h6>
                        <span className="indicator-icon"><em className="icon ni ni-chevron-down"></em></span>
                    </a>
                    <div className="chat-profile-body collapse show" id="chat-settings">
                        <div className="chat-profile-body-inner">
                            <ul className="chat-profile-settings">
                                <li>
                                    <div className="custom-control custom-control-sm custom-switch">
                                        <input type="checkbox" className="custom-control-input" checked="" id="chat-notification-enable" />
                                        <label className="custom-control-label" for="chat-notification-enable">Notifications</label>
                                    </div>
                                </li>
                                <li>
                                    <a className="chat-option-link" href="#">
                                        <em className="icon icon-circle bg-light ni ni-bell-off-fill"></em>
                                        <div>
                                            <span className="lead-text">Ignore Messages</span>
                                            <span className="sub-text">You won’t be notified when message you.</span>
                                        </div>
                                    </a>
                                </li>
                                <li>
                                    <a className="chat-option-link" href="#">
                                        <em className="icon icon-circle bg-light ni ni-alert-fill"></em>
                                        <div>
                                            <span className="lead-text">Something Wrong</span>
                                            <span className="sub-text">Give feedback and report conversion.</span>
                                        </div>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="chat-profile-group">
                    <a href="#" className="chat-profile-head" data-bs-toggle="collapse" data-bs-target="#chat-photos">
                        <h6 className="title overline-title">Shared Photos</h6>
                        <span className="indicator-icon"><em className="icon ni ni-chevron-down"></em></span>
                    </a>
                    <div className="chat-profile-body collapse show" id="chat-photos">
                        <div className="chat-profile-body-inner">
                            <ul className="chat-profile-media">
                                <li><a href="#"><img src="./images/slides/slide-a.jpg" alt="" /></a></li>
                                <li><a href="#"><img src="./images/slides/slide-b.jpg" alt="" /></a></li>
                                <li><a href="#"><img src="./images/slides/slide-c.jpg" alt="" /></a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default InfoBar
