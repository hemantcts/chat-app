import React, { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useProfileImageChanged } from '../context-api/OnlineUsersContext'; // adjust the path if needed

const UserProfile = () => {

    const { profileImageChanged, setProfileImageChanged } = useProfileImageChanged();

    const [userData, setUserData] = useState(null);


    const [name, setName] = useState('');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');

    const [isLoading, setLoading] = useState(false);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://chat.quanteqsolutions.com/api/user/update-profile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token'),
                },
                body: JSON.stringify({ name }),
            });
            const data = await res.json();
            if (data.status) {
                toast.success(data.message || 'Name updated successfully!');
            } else {
                toast.error(data.message || 'Update failed');
            }
        } catch (err) {
            toast.error('Update failed');
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch('https://chat.quanteqsolutions.com/api/user/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token'),
                },
                body: JSON.stringify({
                    currentPassword,
                    newPassword,
                }),
            });
            const data = await res.json();
            if (data.status) {
                toast.success(data.message || 'Password changed successfully!');
                setCurrentPassword('');
                setNewPassword('');
            } else {
                toast.error(data.message || 'password reset failed');
            }
        } catch (err) {
            toast.error('Password reset failed');
        }
    };



    const getUserData = async () => {
        const token = localStorage.getItem("token");

        try {
            const response = await fetch(`https://chat.quanteqsolutions.com/api/auth/get-user`, {
                headers: {
                    "Authorization": token
                }
            });
            const data = await response.json();
            if (data.status) {
                setUserData(data.userData);
                setName(data.userData.name)
                localStorage.setItem('userData', JSON.stringify(data.userData))
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        getUserData()
    }, [])

    const changeProfileImage = async (profileImageUrl) => {
        setLoading(true);
        console.log(profileImageUrl, 'image url')
        const response = await fetch('https://chat.quanteqsolutions.com/api/user/update-profile-image', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem('token'),
            },
            body: JSON.stringify({ profileImageUrl })
        })
        const data = await response.json();

        if (data.status) {
            // toast.success(data.message || 'Profile image uploaded')
            getUserData();
            setTimeout(() => {
                setLoading(false);
            }, 700);
            setProfileImageChanged(prev => !prev);
        }
        else {
            toast.error(data.message || 'Profile image uploaded failed')
        }
    }

    return (
        <div className="nk-content p-0 mt-0">
            <div className="nk-content-inner">
                <div className="nk-content-body">
                    <div className="nk-chat">
                        {/* <div className='nk-chat-aside'>
                            <div className="nk-chat-aside-head">
                                {userData?.imagePath ? (
                                    <div className={`chat-media user-avatar bg-purple group-image user-profile-image ${isLoading ? 'rotate-it' : ''}`} style={{ backgroundImage: `url(https://chat.quanteqsolutions.com/${userData?.imagePath})` }}></div>
                                ) : (
                                    <div className={`chat-media user-avatar user-avatar2 bg-purple group-image user-profile-image ${isLoading ? 'rotate-it' : ''}`} >
                                        <em className="icon ni ni-user-alt"></em>
                                    </div>
                                )}
                            </div>
                            <div className="nk-chat-aside-body">
                                <div className="d-flex flex-wrap">
                                    <div className="col-4 d-flex justify-content-center mt-3">
                                        <button onClick={() => changeProfileImage('/uploads/group/avatar-img1.jpg')} className="chat-media user-avatar bg-purple group-image border-0" style={{ backgroundImage: 'url(https://chat.quanteqsolutions.com/uploads/group/avatar-img1.jpg)' }}></button>
                                    </div>
                                    <div className="col-4 d-flex justify-content-center mt-3">
                                        <button onClick={() => changeProfileImage('/uploads/group/avatar-img2.jpg')} className="chat-media user-avatar bg-purple group-image border-0" style={{ backgroundImage: 'url(https://chat.quanteqsolutions.com/uploads/group/avatar-img2.jpg)' }}></button>
                                    </div>
                                    <div className="col-4 d-flex justify-content-center mt-3">
                                        <button onClick={() => changeProfileImage('/uploads/group/avatar-img3.jpg')} className="chat-media user-avatar bg-purple group-image border-0" style={{ backgroundImage: 'url(https://chat.quanteqsolutions.com/uploads/group/avatar-img3.jpg)' }}></button>
                                    </div>
                                    <div className="col-4 d-flex justify-content-center mt-3">
                                        <button onClick={() => changeProfileImage('/uploads/group/avatar-img4.jpg')} className="chat-media user-avatar bg-purple group-image border-0" style={{ backgroundImage: 'url(https://chat.quanteqsolutions.com/uploads/group/avatar-img4.jpg)' }}></button>
                                    </div>
                                    <div className="col-4 d-flex justify-content-center mt-3">
                                        <button onClick={() => changeProfileImage('/uploads/group/avatar-img5.jpg')} className="chat-media user-avatar bg-purple group-image border-0" style={{ backgroundImage: 'url(https://chat.quanteqsolutions.com/uploads/group/avatar-img5.jpg)' }}></button>
                                    </div>
                                    <div className="col-4 d-flex justify-content-center mt-3">
                                        <button onClick={() => changeProfileImage('/uploads/group/avatar-img6.jpg')} className="chat-media user-avatar bg-purple group-image border-0" style={{ backgroundImage: 'url(https://chat.quanteqsolutions.com/uploads/group/avatar-img6.jpg)' }}></button>
                                    </div>
                                    <div className="col-4 d-flex justify-content-center mt-3">
                                        <button onClick={() => changeProfileImage('/uploads/group/avatar-img7.jpg')} className="chat-media user-avatar bg-purple group-image border-0" style={{ backgroundImage: 'url(https://chat.quanteqsolutions.com/uploads/group/avatar-img7.jpg)' }}></button>
                                    </div>
                                    <div className="col-4 d-flex justify-content-center mt-3">
                                        <button onClick={() => changeProfileImage('/uploads/group/avatar-img8.jpg')} className="chat-media user-avatar bg-purple group-image border-0" style={{ backgroundImage: 'url(https://chat.quanteqsolutions.com/uploads/group/avatar-img8.jpg)' }}></button>
                                    </div>
                                    <div className="col-4 d-flex justify-content-center mt-3">
                                        <button onClick={() => changeProfileImage('/uploads/group/avatar-img9.jpg')} className="chat-media user-avatar bg-purple group-image border-0" style={{ backgroundImage: 'url(https://chat.quanteqsolutions.com/uploads/group/avatar-img9.jpg)' }}></button>
                                    </div>
                                </div>
                            </div>
                        </div> */}
                        <div className="nk-chat-body profile-shown p-4">
                            <div className="row">

                                {/* RIGHT: User Info & Actions */}
                                <div className="col-md-6">
                                    <h4>User Profile</h4>

                                    {/* Update Name */}
                                    <form onSubmit={handleUpdateProfile}>
                                        <div className="form-group mb-3">
                                            <label>Name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={name}
                                                onChange={(e) => setName(e.target.value)}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-primary">
                                            Update Name
                                        </button>
                                    </form>

                                    <hr className="my-4" />

                                    {/* Reset Password */}
                                    <form onSubmit={handleResetPassword}>
                                        <h5>Reset Password</h5>
                                        <div className="form-group mb-2">
                                            <label>Current Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={currentPassword}
                                                onChange={(e) => setCurrentPassword(e.target.value)}
                                            />
                                        </div>
                                        <div className="form-group mb-2">
                                            <label>New Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                value={newPassword}
                                                onChange={(e) => setNewPassword(e.target.value)}
                                            />
                                        </div>
                                        <button type="submit" className="btn btn-warning">
                                            Reset Password
                                        </button>
                                    </form>

                                </div>

                                <div className="col-md-6">

                                    {/* User Details (readonly) */}
                                    <h4>User Details</h4>
                                    <ul className="list-group">
                                        <li className="list-group-item"><strong>Email:</strong> {userData?.email}</li>
                                        <li className="list-group-item"><strong>Department:</strong> {userData?.department}</li>

                                        {/* <li className="list-group-item"><strong>Group Create Access:</strong> {userData?.groupCreateAccess ? 'Yes' : 'No'}</li>
                                        <li className="list-group-item"><strong>One-on-One Access:</strong> {userData?.oneOnOneAccess ? 'Yes' : 'No'}</li>
                                        <li className="list-group-item"><strong>App Access:</strong> {userData?.appAccess ? 'Yes' : 'No'}</li>
                                        <li className="list-group-item"><strong>Active:</strong> {userData?.active ? 'Yes' : 'No'}</li> */}

                                        <li className="list-group-item"><strong>Registration Date:</strong> {userData?.createdAt && new Date(userData?.createdAt).toLocaleDateString('en-AU', {
                                            day: '2-digit',
                                            month: 'long',
                                            year: 'numeric',
                                            timeZone: 'Australia/Melbourne'
                                        })}</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default UserProfile
