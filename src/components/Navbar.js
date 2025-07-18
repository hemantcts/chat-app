import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import socket from '../utils/socket';
import { useProfileImageChanged } from '../context-api/OnlineUsersContext';

const Navbar = ({ page, pageHeading }) => {
    const { profileImageChanged } = useProfileImageChanged();

    const navigate = useNavigate();
    const [userId, setUserId] = useState(null);
    const loggedInUser = JSON.parse(localStorage.getItem('userData'));

    useEffect(() => {
        if (!localStorage.getItem("token")) {
            navigate("/");
        }
        else {
            verifyUser();
        }

        // eslint-disable-next-line
    }, [profileImageChanged])

    const verifyUser = async () => {
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
                if (!data.userData.active) {
                    localStorage.removeItem('token');
                    navigate("/");
                }
                console.log("Authentication completed");
                socket.emit('connectUser', { userId: data.userData._id });
                localStorage.setItem('userData', JSON.stringify(data.userData))
                setUserId(data.userData._id);

            }
            else {
                localStorage.removeItem('token');
                navigate("/");
            }
        }
        catch (error) {
            console.error(error);
        }
    }

    const handleLogout = () => {
        socket.emit('disconnectUser', userId)
        localStorage.clear();
        navigate('/');
    }

    return (
        <div className="nk-header nk-header-fixed is-light">
            <div className="container-fluid">
                <div className="nk-header-wrap">
                    {/* <div className="nk-menu-trigger d-xl-none ml-n1">
                        <a href="#" className="nk-nav-toggle nk-quick-nav-icon" data-target="sidebarMenu"><em className="icon ni ni-menu"></em></a>
                    </div> */}
                    <div className="nk-header-app-name">
                        {/* <div className="nk-header-app-logo">
                            {page === 'Chat' && <em className="icon ni ni-chat-circle bg-info-dim"></em>}
                            {page !== 'Chat' && <em className="icon ni ni-inbox bg-purple-dim"></em>}
                        </div> */}
                        <div className="nk-header-app-info">
                            <span className="sub-text">{page}</span>
                            <span className="lead-text">{pageHeading}</span>
                        </div>
                    </div>
                    <div className="nk-header-tools">
                        <ul className="nk-quick-nav">
                            {/* <li className="dropdown hide-mb-sm">
                                <a href="#" data-toggle="modal" data-target="#region" className="nk-quick-nav-icon"><em className="icon ni ni-globe"></em></a>
                            </li> */}
                            {/* <li className="dropdown chats-dropdown hide-mb-sm">
                                <a href="#" className="dropdown-toggle nk-quick-nav-icon" data-toggle="dropdown">
                                    <div className="icon-status icon-status-na"><em className="icon ni ni-comments"></em></div>
                                </a>
                                <div className="dropdown-menu dropdown-menu-xl dropdown-menu-right">
                                    <div className="dropdown-head">
                                        <span className="sub-title nk-dropdown-title">Recent Chats</span>
                                        <a href="#">Setting</a>
                                    </div>
                                    <div className="dropdown-body">
                                        <ul className="chat-list">
                                            <li className="chat-item">
                                                <a className="chat-link" href="html/apps/chats.html">
                                                    <div className="chat-media user-avatar">
                                                        <span>IH</span>
                                                        <span className="status dot dot-lg dot-gray"></span>
                                                    </div>
                                                    <div className="chat-info">
                                                        <div className="chat-from">
                                                            <div className="name">Iliash Hossain</div>
                                                            <span className="time">Now</span>
                                                        </div>
                                                        <div className="chat-context">
                                                            <div className="text">You: Please confrim if you got my last messages.</div>
                                                            <div className="status delivered">
                                                                <em className="icon ni ni-check-circle-fill"></em>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li className="chat-item is-unread">
                                                <a className="chat-link" href="html/apps/chats.html">
                                                    <div className="chat-media user-avatar bg-pink">
                                                        <span>AB</span>
                                                        <span className="status dot dot-lg dot-success"></span>
                                                    </div>
                                                    <div className="chat-info">
                                                        <div className="chat-from">
                                                            <div className="name">Abu Bin Ishtiyak</div>
                                                            <span className="time">4:49 AM</span>
                                                        </div>
                                                        <div className="chat-context">
                                                            <div className="text">Hi, I am Ishtiyak, can you help me with this problem ?</div>
                                                            <div className="status unread">
                                                                <em className="icon ni ni-bullet-fill"></em>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li className="chat-item">
                                                <a className="chat-link" href="html/apps/chats.html">
                                                    <div className="chat-media user-avatar">
                                                        <img src="./images/avatar/b-sm.jpg" alt="" />
                                                    </div>
                                                    <div className="chat-info">
                                                        <div className="chat-from">
                                                            <div className="name">George Philips</div>
                                                            <span className="time">6 Apr</span>
                                                        </div>
                                                        <div className="chat-context">
                                                            <div className="text">Have you seens the claim from Rose?</div>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li className="chat-item">
                                                <a className="chat-link" href="html/apps/chats.html">
                                                    <div className="chat-media user-avatar user-avatar-multiple">
                                                        <div className="user-avatar">
                                                            <img src="./images/avatar/c-sm.jpg" alt="" />
                                                        </div>
                                                        <div className="user-avatar">
                                                            <span>AB</span>
                                                        </div>
                                                    </div>
                                                    <div className="chat-info">
                                                        <div className="chat-from">
                                                            <div className="name">Softnio Group</div>
                                                            <span className="time">27 Mar</span>
                                                        </div>
                                                        <div className="chat-context">
                                                            <div className="text">You: I just bought a new computer but i am having some problem</div>
                                                            <div className="status sent">
                                                                <em className="icon ni ni-check-circle"></em>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li className="chat-item">
                                                <a className="chat-link" href="html/apps/chats.html">
                                                    <div className="chat-media user-avatar">
                                                        <img src="./images/avatar/a-sm.jpg" alt="" />
                                                        <span className="status dot dot-lg dot-success"></span>
                                                    </div>
                                                    <div className="chat-info">
                                                        <div className="chat-from">
                                                            <div className="name">Larry Hughes</div>
                                                            <span className="time">3 Apr</span>
                                                        </div>
                                                        <div className="chat-context">
                                                            <div className="text">Hi Frank! How is you doing?</div>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                            <li className="chat-item">
                                                <a className="chat-link" href="html/apps/chats.html">
                                                    <div className="chat-media user-avatar bg-purple">
                                                        <span>TW</span>
                                                    </div>
                                                    <div className="chat-info">
                                                        <div className="chat-from">
                                                            <div className="name">Tammy Wilson</div>
                                                            <span className="time">27 Mar</span>
                                                        </div>
                                                        <div className="chat-context">
                                                            <div className="text">You: I just bought a new computer but i am having some problem</div>
                                                            <div className="status sent">
                                                                <em className="icon ni ni-check-circle"></em>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="dropdown-foot center">
                                        <a href="html/chats.html">View All</a>
                                    </div>
                                </div>
                            </li> */}
                            {/* <li className="dropdown notification-dropdown">
                                <a href="#" className="dropdown-toggle nk-quick-nav-icon" data-toggle="dropdown">
                                    <div className="icon-status icon-status-info"><em className="icon ni ni-bell"></em></div>
                                </a>
                                <div className="dropdown-menu dropdown-menu-xl dropdown-menu-right">
                                    <div className="dropdown-head">
                                        <span className="sub-title nk-dropdown-title">Notifications</span>
                                        <a href="#">Mark All as Read</a>
                                    </div>
                                    <div className="dropdown-body">
                                        <div className="nk-notification">
                                            <div className="nk-notification-item dropdown-inner">
                                                <div className="nk-notification-icon">
                                                    <em className="icon icon-circle bg-primary-dim ni ni-share"></em>
                                                </div>
                                                <div className="nk-notification-content">
                                                    <div className="nk-notification-text">Iliash shared <span>Dashlite-v2</span> with you.</div>
                                                    <div className="nk-notification-time">Just now</div>
                                                </div>
                                            </div>
                                            <div className="nk-notification-item dropdown-inner">
                                                <div className="nk-notification-icon">
                                                    <em className="icon icon-circle bg-info-dim ni ni-edit"></em>
                                                </div>
                                                <div className="nk-notification-content">
                                                    <div className="nk-notification-text">Iliash <span>invited</span> you to edit <span>DashLite</span> folder</div>
                                                    <div className="nk-notification-time">2 hrs ago</div>
                                                </div>
                                            </div>
                                            <div className="nk-notification-item dropdown-inner">
                                                <div className="nk-notification-icon">
                                                    <em className="icon icon-circle bg-primary-dim ni ni-share"></em>
                                                </div>
                                                <div className="nk-notification-content">
                                                    <div className="nk-notification-text">You have shared <span>project v2</span> with Parvez.</div>
                                                    <div className="nk-notification-time">7 days ago</div>
                                                </div>
                                            </div>
                                            <div className="nk-notification-item dropdown-inner">
                                                <div className="nk-notification-icon">
                                                    <em className="icon icon-circle bg-success-dim ni ni-spark"></em>
                                                </div>
                                                <div className="nk-notification-content">
                                                    <div className="nk-notification-text">Your <span>Subscription</span> renew successfully.</div>
                                                    <div className="nk-notification-time">2 month ago</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="dropdown-foot center">
                                        <a href="#">View All</a>
                                    </div>
                                </div>
                            </li> */}
                            {/* <li className="dropdown list-apps-dropdown d-lg-none">
                                <a href="#" className="dropdown-toggle nk-quick-nav-icon" data-toggle="dropdown">
                                    <div className="icon-status icon-status-na"><em className="icon ni ni-menu-circled"></em></div>
                                </a>
                                <div className="dropdown-menu dropdown-menu-lg dropdown-menu-right">
                                    <div className="dropdown-body">
                                        <ul className="list-apps">
                                            <li>
                                                <a href="html/index.html">
                                                    <span className="list-apps-media"><em className="icon ni ni-dashlite bg-primary text-white"></em></span>
                                                    <span className="list-apps-title">Dashboard</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="html/apps/chats.html">
                                                    <span className="list-apps-media"><em className="icon ni ni-chat-circle bg-info-dim"></em></span>
                                                    <span className="list-apps-title">Chats</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="html/apps/mailbox.html">
                                                    <span className="list-apps-media"><em className="icon ni ni-inbox bg-purple-dim"></em></span>
                                                    <span className="list-apps-title">Mailbox</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="html/apps/messages.html">
                                                    <span className="list-apps-media"><em className="icon ni ni-chat bg-success-dim"></em></span>
                                                    <span className="list-apps-title">Messages</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="html/apps/file-manager.html">
                                                    <span className="list-apps-media"><em className="icon ni ni-folder bg-purple-dim"></em></span>
                                                    <span className="list-apps-title">File Manager</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="html/components.html">
                                                    <span className="list-apps-media"><em className="icon ni ni-layers bg-secondary-dim"></em></span>
                                                    <span className="list-apps-title">Components</span>
                                                </a>
                                            </li>
                                        </ul>
                                        <ul className="list-apps">
                                            <li>
                                                <a href="/demo2/ecommerce/index.html">
                                                    <span className="list-apps-media"><em className="icon ni ni-cart bg-danger-dim"></em></span>
                                                    <span className="list-apps-title">Ecommerce Panel</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/demo4/subscription/index.html">
                                                    <span className="list-apps-media"><em className="icon ni ni-calendar-booking bg-primary-dim"></em></span>
                                                    <span className="list-apps-title">Subscription Panel</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/demo5/crypto/index.html">
                                                    <span className="list-apps-media"><em className="icon ni ni-bitcoin-cash bg-warning-dim"></em></span>
                                                    <span className="list-apps-title">Crypto Wallet Panel</span>
                                                </a>
                                            </li>
                                            <li>
                                                <a href="/demo6/invest/index.html">
                                                    <span className="list-apps-media"><em className="icon ni ni-invest bg-blue-dim"></em></span>
                                                    <span className="list-apps-title">HYIP Invest Panel</span>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </li> */}
                            {/* <li className="dropdown language-dropdown d-none d-sm-block mr-n1">
                                <a href="#" className="dropdown-toggle nk-quick-nav-icon" data-toggle="dropdown">
                                    <div className="quick-icon border border-light">
                                        <img className="icon" src="./images/flags/english-sq.png" alt="" />
                                    </div>
                                </a>
                                <div className="dropdown-menu dropdown-menu-right dropdown-menu-s1">
                                    <ul className="language-list">
                                        <li>
                                            <a href="#" className="language-item">
                                                <img src="./images/flags/english.png" alt="" className="language-flag" />
                                                <span className="language-name">English</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="language-item">
                                                <img src="./images/flags/spanish.png" alt="" className="language-flag" />
                                                <span className="language-name">Español</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="language-item">
                                                <img src="./images/flags/french.png" alt="" className="language-flag" />
                                                <span className="language-name">Français</span>
                                            </a>
                                        </li>
                                        <li>
                                            <a href="#" className="language-item">
                                                <img src="./images/flags/turkey.png" alt="" className="language-flag" />
                                                <span className="language-name">Türkçe</span>
                                            </a>
                                        </li>
                                    </ul>
                                </div>
                            </li> */}
                            <li className="dropdown user-dropdown">
                                <a href="#" className="dropdown-toggle mr-n1" data-bs-toggle="dropdown" aria-expanded="false">
                                    <div className="user-toggle">
                                        <div className="user-avatar sm" style={{ backgroundImage: `url(https://chat.quanteqsolutions.com/${loggedInUser?.imagePath})` }}>
                                            {/* <em className="icon ni ni-user-alt"></em> */}
                                            {!loggedInUser?.imagePath && <span>{loggedInUser?.name?.slice(0, 2).toUpperCase()}</span>}
                                        </div>
                                    </div>
                                </a>

                                <div className="dropdown-menu dropdown-menu-md dropdown-menu-right">
                                    <div className="dropdown-inner user-card-wrap bg-lighter d-none d-md-block">
                                        <div className="user-card">
                                            <div className="user-avatar" style={{ backgroundImage: `url(https://chat.quanteqsolutions.com/${loggedInUser?.imagePath})` }}>
                                                {!loggedInUser?.imagePath && <span>{loggedInUser?.name?.slice(0, 2).toUpperCase()}</span>}
                                            </div>
                                            <div className="user-info">
                                                <span className="lead-text">{loggedInUser?.name}</span>
                                                <span className="sub-text">{loggedInUser?.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="dropdown-inner">
                                        <ul className="link-list">
                                            <li><Link to="/dashboard/profile"><em className="icon ni ni-user-alt"></em><span>View Profile</span></Link></li>
                                            {/* <li><a href="#"><em className="icon ni ni-setting-alt"></em><span>Account Setting</span></a></li>
                                            <li><a href="#"><em className="icon ni ni-activity-alt"></em><span>Login Activity</span></a></li>
                                            <li><a className="dark-switch" href="#"><em className="icon ni ni-moon"></em><span>Dark Mode</span></a></li> */}
                                        </ul>
                                    </div>
                                    <div className="dropdown-inner">
                                        <ul className="link-list">
                                            <li><a href="#" onClick={handleLogout}><em className="icon ni ni-signout"></em><span>Sign out</span></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar
