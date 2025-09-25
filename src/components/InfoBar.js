import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AddMemberModal from './AddMemberModal';
import ImageCropperModal from './ImageCropperModal';
import ConfirmModal from './ConfirmModal';

const InfoBar = ({ showDetails, setShowDetails, groupDetails, groupName, setGroupName, getGroupDetails, onlineUsers }) => {
    const [isEditing, setIsEditing] = useState(false);
    const [showMembers, setShowMembers] = useState(false);
    const [isNameChanged, setIsNameChanged] = useState(false);
    const [users, setUsers] = useState([])
    const [selectedMembers, setSelectedMembers] = useState([])

    const [showModal, setShowModal] = useState(false);


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

                const filteredUsers = allUsers.filter(user => !members.includes(user._id) && user.active);
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

    const addMembers = async (selectedMembers, hiddenMembers) => {
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
                body: JSON.stringify({ groupId: groupDetails._id, members, hiddenMembers })
            });
            const data = await res.json();

            if (data.status) {
                toast.success(data.message || 'member added!');
                getGroupDetails();

                const allUsers = users;
                const filteredUsers = allUsers.filter(user => !members.includes(user._id) && user.active);
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

    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState(null);


    const showRemoveModal = (member) => {
        setSelectedMessages(member);
        setConfirmModalVisible(true);
    };

    const hideModal = () => {
        setConfirmModalVisible(false);
        setSelectedMessages(null);
    };

    const removeMembers = async (member) => {
        let arr = [];
        arr.push(selectedMessages);
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
                // toast.success(data.message || 'member removed successfully');
                toast.success('member removed successfully');
                getGroupDetails();
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

    const handleRouteClick = () => {
        setShowDetails(false)
    }


    const [cropperOpen, setCropperOpen] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setSelectedImage(reader.result);
                setCropperOpen(true);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCropDone = async (croppedBlob) => {
        setCropperOpen(false);

        const formData = new FormData();
        formData.append('groupId', groupDetails?._id);
        formData.append('files', croppedBlob, 'group.jpg');

        const res = await fetch('https://chat.quanteqsolutions.com/api/groups/upload', {
            method: 'POST',
            headers: {
                Authorization: `${localStorage.getItem('token')}`
            },
            body: formData
        });

        const data = await res.json();

        if (data.status) {
            toast.success(data.message)
            getGroupDetails();
        }
    };

    return (
        <div className={`nk-chat-profile ${showDetails ? 'visible' : ''}`} data-simplebar>
            <div className="user-card user-card-s2 my-4">
                <div
                    className="user-avatar-wrapper"
                    onClick={() => {
                        if(groupDetails?.membersInfo?.some(m => m.userId === loggedInUser?._id && m.isHidden)){
                            return;
                        }
                        document.getElementById('group-image-upload').click()
                    }}
                >
                    <div
                        className="user-avatar md bg-purple group-image group-image-change"
                        style={{
                            backgroundImage: groupDetails?.groupImage
                                ? `url(https://chat.quanteqsolutions.com/${groupDetails?.groupImage})`
                                : 'none',
                        }}
                    >
                        {!groupDetails?.groupImage && (
                            <span>{groupDetails?.name?.slice(0, 2).toUpperCase()}</span>
                        )}
                        {!(groupDetails?.membersInfo?.some(m => m.userId === loggedInUser?._id && m.isHidden)) && <div className="avatar-hover-overlay">
                            <span className="camera-icon">📷</span>
                            <span className="hover-text">edit</span>
                        </div>}
                    </div>

                    {!(groupDetails?.membersInfo?.some(m => m.userId === loggedInUser?._id && m.isHidden)) && <input
                        type="file"
                        id="group-image-upload"
                        accept="image/*"
                        onChange={handleImageChange}
                        style={{ display: 'none' }}
                    />}
                </div>


                {cropperOpen && (
                    <ImageCropperModal
                        imageSrc={selectedImage}
                        onClose={() => setCropperOpen(false)}
                        onCropDone={handleCropDone}
                    />
                )}


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
                            {!(groupDetails?.membersInfo?.some(m => m.userId === loggedInUser?._id && m.isHidden)) && <em
                                onClick={handleEditClick}
                                className="icon ni ni-edit-alt-fill"
                                style={{ cursor: 'pointer' }}
                                title="Edit group name"
                            ></em>}
                        </>
                    )}
                    {/* <h5 style={{ display: 'inline-block' }}>{groupName}</h5> <em onClick={handleChangeName} className="icon ni ni-edit-alt-fill" style={{ cursor: 'pointer' }}></em> */}
                    <span className="sub-text">
                        <span style={{ fontWeight: '700' }}>
                            Total Members : {groupDetails?.members?.length}
                        </span>
                    </span>

                    {showMembers && <div className="members-list">
                        <span className="sub-text justify-content-start">Group Members : {groupDetails?.members?.length} </span>
                        <ul className={`chat-list ${users.length === 0 ? 'border-0' : ''}`} style={{ borderBottom: '2px solid #8094ae' }}>
                            {groupDetails?.members?.map((group, index) => (
                                <li key={index} className={`chat-item`}>
                                    <div className="chat-link chat-open current" >
                                        <div className="chat-media user-avatar bg-purple" style={{ backgroundImage: `url(https://chat.quanteqsolutions.com/${group?.imagePath})` }}>
                                            {!group?.imagePath && <span>{group?.name?.slice(0, 2).toUpperCase()}</span>}
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
                                    {(group?._id !== loggedInUser?._id) && <div className="chat-actions">
                                        <div className="dropdown">
                                            <a href="#" className="btn btn-icon btn-sm btn-trigger dropdown-toggle" data-bs-toggle="dropdown"><em className="icon ni ni-more-h"></em></a>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                <ul className="link-list-opt no-bdr">
                                                    {loggedInUser?.role === 1 && <li><a href="#" onClick={() => showRemoveModal(group._id)}>Remove Member</a></li>}
                                                    <li><Link to={`/dashboard/chat?user=${group._id}`} onClick={handleRouteClick}>Start Chat</Link></li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>}
                                </li>
                            ))}
                        </ul>

                        {(loggedInUser?.role === 1) && <Button onClick={() => setShowModal(true)} className="sub-text justify-content-start mt-1 123">
                            Add New Members2
                        </Button>}

                        <ul className='chat-list'>
                            {users.map((group, index) => (
                                <li key={index} className={`chat-item`}>
                                    <div className="chat-link chat-open current" >
                                        <div className="chat-media user-avatar bg-purple" style={{ backgroundImage: `url(https://chat.quanteqsolutions.com/${group?.imagePath})` }}>
                                            {!group?.imagePath && <span>{group?.name?.slice(0, 2).toUpperCase()}</span>}
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
                {/* <div className="user-card-menu dropdown">
                    <a href="#" className="btn btn-icon btn-sm btn-trigger dropdown-toggle" data-bs-toggle="dropdown"><em className="icon ni ni-more-h"></em></a>
                    <div className="dropdown-menu dropdown-menu-right">
                        <ul className="link-list-opt no-bdr">
                            <li><a href="#"><em className="icon ni ni-eye"></em><span>View Profile</span></a></li>
                            <li><a href="#"><em className="icon ni ni-na"></em><span>Block Messages</span></a></li>
                        </ul>
                    </div>
                </div> */}
            </div>
            <div className="chat-profile ">
                <div className="members-list position-static border-0">

                    <span className="sub-text d-flex justify-content-between">
                        Members : {groupDetails?.members?.length}
                        {/* <span className='add-members'  >Add Members</span>  */}
                        {!(groupDetails?.membersInfo?.some(m => m.userId === loggedInUser?._id && m.isHidden)) && <Button onClick={() => setShowModal(true)} className="sub-text justify-content-start m-0 p-0 border-0 add-member-btn" style={{ backgroundColor: 'transparent' }}>
                            Add New Members
                        </Button>}
                    </span>
                    <ul className={`chat-list`} >
                        {groupDetails?.members?.filter(m => {
                            // exclude self always
                            if (m._id === '683d32d6952bd329b2fa1c9a') return false;

                            // get memberInfo for this user
                            const info = groupDetails?.membersInfo?.find(mi => mi.userId === m._id);

                            // if current user is admin, ignore hidden filter
                            if (loggedInUser?.role === 1) {
                                return true;
                            }

                            // for non-admins, filter out hidden members
                            return !info?.isHidden;
                        })
                            ?.map((group, index) => (
                                <li key={index} className={`chat-item`}>
                                    <div className="chat-link chat-open current" >
                                        <div className="chat-media user-avatar bg-purple" style={{ backgroundImage: `url(https://chat.quanteqsolutions.com/${group?.imagePath})` }}>
                                            {!group?.imagePath && <span>{group?.name?.slice(0, 2).toUpperCase()}</span>}
                                            <span className={`status dot dot-lg ${onlineUsers[group._id] ? 'dot-success' : 'dot-gray'} `}></span>
                                        </div>
                                        <div className="chat-info">
                                            <div className="chat-from" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                                <div className="name" style={{ color: groupDetails?.membersInfo?.find(mi => mi.userId === group._id)?.isHidden && '#ccc' }}>{group?.name}</div>
                                                {(groupDetails?.membersInfo?.find(mi => mi.userId === group._id)?.isHidden) && <div className="hidden_tag" style={{ color: '#ccc', fontSize: 12 }}>hidden user</div>}
                                                {/* <span className="time">Now</span> */}
                                            </div>
                                            <div className="chat-context">
                                                {/* <div className="text">{group?.email}</div> */}
                                                {/* <div className="status delivered">
                                                <em className="icon ni ni-check-circle-fill"></em>
                                            </div> */}
                                            </div>
                                        </div>
                                    </div>
                                    {!(groupDetails?.membersInfo?.some(m => m.userId === loggedInUser?._id && m.isHidden)) && <div className="chat-actions">
                                        <div className="dropdown">
                                            <a href="#" className="btn btn-icon btn-sm btn-trigger dropdown-toggle" data-bs-toggle="dropdown"><em className="icon ni ni-more-h"></em></a>
                                            <div className="dropdown-menu dropdown-menu-right">
                                                <ul className="link-list-opt no-bdr">
                                                    {(loggedInUser?.role === 1 || loggedInUser?.groupCreateAccess) && <li><a href="#" onClick={() => showRemoveModal(group._id)}>Remove Member</a></li>}
                                                    {(loggedInUser?.role === 1 || loggedInUser?.oneOnOneAccess) && <li><Link to={`/dashboard/chat?user=${group._id}`} onClick={handleRouteClick}>Start Chat</Link></li>}
                                                </ul>
                                            </div>
                                        </div>
                                    </div>}
                                </li>
                            ))}
                    </ul>
                </div>

                {/* <div className="chat-profile-group">
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
                </div> */}
            </div>

            <AddMemberModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                onUserAdded={fetchUsers}
                users={users}
                onlineUsers={onlineUsers}
                addMembers={addMembers}
                loggedInUser={loggedInUser}
            />

            <ConfirmModal
                show={confirmModalVisible}
                handleClose={hideModal}
                onConfirm={removeMembers}
                title="Confirm Remove Member"
                message="Are you sure you want to remove this member?"
            />

        </div>
    )
}

export default InfoBar
