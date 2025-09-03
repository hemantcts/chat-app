import React from 'react'
import { Link, useLocation } from 'react-router-dom'
// import '../assets/images'

const Sidebar = () => {
    const loggedInUser = JSON.parse(localStorage.getItem('userData'));

    const { pathname } = useLocation();

    const page = (() => {
        if (pathname === '/dashboard/users') return 'users';
        return 'Dashboard';
    })();


    return (

        <div className="nk-apps-sidebar is-dark">
            <div className="nk-apps-brand">
                {/* <a href="html/index.html" className="logo-link">
                    <img className="logo-light logo-img" src="../assets/images/logo-small.png" srcset="../assets/images/logo-small2x.png 2x" alt="logo" />
                    <img className="logo-dark logo-img" src="../assets/images/logo-dark-small.png" srcset="../assets/images/logo-dark-small2x.png 2x" alt="logo-dark" />
                </a> */}
            </div>
            <div className="nk-sidebar-element">
                <div className="nk-sidebar-body">
                    <div className="nk-sidebar-content" data-simplebar>
                        <div className="nk-sidebar-menu">
                            {/* <!-- Menu --> */}
                            <ul className="nk-menu apps-menu">
                                {/* <li className="nk-menu-item">
                                    <a href="html/cms/index.html" className="nk-menu-link" title="CMS Panel">
                                        <span className="nk-menu-icon"><em className="icon ni ni-template"></em></span>
                                    </a>
                                </li>
                                <li className="nk-menu-hr"></li>
                                <li className="nk-menu-item">
                                    <a href="html/index.html" className="nk-menu-link" title="Analytics Dashboard">
                                        <span className="nk-menu-icon"><em className="icon ni ni-dashboard"></em></span>
                                    </a>
                                </li>
                                <li className="nk-menu-item">
                                    <a href="html/index-sales.html" className="nk-menu-link" title="Sales Dashboard">
                                        <span className="nk-menu-icon"><em className="icon ni ni-speed"></em></span>
                                    </a>
                                </li>
                                <li className="nk-menu-item">
                                    <a href="html/index-crypto.html" className="nk-menu-link" title="Crypto Dashboard">
                                        <span className="nk-menu-icon"><em className="icon ni ni-bitcoin-cash"></em></span>
                                    </a>
                                </li>
                                <li className="nk-menu-item">
                                    <a href="html/index-invest.html" className="nk-menu-link" title="Invest Dashboard">
                                        <span className="nk-menu-icon"><em className="icon ni ni-invest"></em></span>
                                    </a>
                                </li> */}
                                {/* <li className="nk-menu-hr"></li> */}
                                <li className={`nk-menu-item ${page==='users' ? 'active' : ''}`}>
                                    {/* <a href="html/apps/mailbox.html" className="nk-menu-link" title="Mailbox">
                                        <span className="nk-menu-icon"><em className="icon ni ni-inbox"></em></span>
                                    </a> */}

                                    {loggedInUser?.role === 1 && <Link to="/dashboard/users" className="nk-menu-link active" title="Users">
                                        <span className="nk-menu-icon">
                                            <em className="icon ni ni-user"></em>
                                        </span>
                                    </Link>}
                                </li>
                                {/* <li className="nk-menu-item">
                                    <a href="html/apps/messages.html" className="nk-menu-link" title="Messages">
                                        <span className="nk-menu-icon"><em className="icon ni ni-chat"></em></span>
                                    </a>
                                </li>
                                <li className="nk-menu-item">
                                    <a href="html/apps/file-manager.html" className="nk-menu-link" title="File Manager">
                                        <span className="nk-menu-icon"><em className="icon ni ni-folder"></em></span>
                                    </a>
                                </li> */}
                                <li className={`nk-menu-item ${page!=='users' ? 'active' : ''}`}>
                                    {/* <a href="html/apps/chats.html" className="nk-menu-link" title="Chats">
                                        <span className="nk-menu-icon"><em className="icon ni ni-chat-circle"></em></span>
                                    </a> */}

                                    <Link to="/dashboard/chat" className="nk-menu-link" title="Chats">
                                        <span className="nk-menu-icon">
                                            <em className="icon ni ni-chat-circle"></em>
                                        </span>
                                    </Link>
                                </li>
                                {/* <li className="nk-menu-item">
                                    <a href="html/apps/calendar.html" className="nk-menu-link" title="Calendar">
                                        <span className="nk-menu-icon"><em className="icon ni ni-calendar"></em></span>
                                    </a>
                                </li>
                                <li className="nk-menu-item">
                                    <a href="html/apps/kanban.html" className="nk-menu-link">
                                        <span className="nk-menu-icon"><em className="icon ni ni-template"></em></span>
                                    </a>
                                </li>
                                <li className="nk-menu-hr"></li>
                                <li className="nk-menu-item">
                                    <a href="html/components.html" className="nk-menu-link" title="Go to Components">
                                        <span className="nk-menu-icon"><em className="icon ni ni-layers"></em></span>
                                    </a>
                                </li> */}
                            </ul>
                        </div>
                        {/* <div className="nk-sidebar-footer">
                            <ul className="nk-menu nk-menu-md">
                                <li className="nk-menu-item">
                                    <a href="#" className="nk-menu-link" title="Settings">
                                        <span className="nk-menu-icon"><em className="icon ni ni-setting"></em></span>
                                    </a>
                                </li>
                            </ul>
                        </div> */}
                    </div>
                    <div className="nk-sidebar-profile nk-sidebar-profile-fixed dropdown">
                        {/* <a href="#" data-toggle="dropdown" data-offset="50,-60">
                            <div className="user-avatar">
                                <span>AB</span>
                            </div>
                        </a> */}
                        <div className="dropdown-menu dropdown-menu-md ml-4">
                            <div className="dropdown-inner user-card-wrap d-none d-md-block">
                                <div className="user-card">
                                    <div className="user-avatar">
                                        <span>AB</span>
                                    </div>
                                    <div className="user-info">
                                        <span className="lead-text">Abu Bin Ishtiyak</span>
                                        <span className="sub-text text-soft">info@softnio.com</span>
                                    </div>
                                </div>
                            </div>
                            <div className="dropdown-inner">
                                <ul className="link-list">
                                    <li><a href="html/user-profile-regular.html"><em className="icon ni ni-user-alt"></em><span>View Profile</span></a></li>
                                    <li><a href="html/user-profile-setting.html"><em className="icon ni ni-setting-alt"></em><span>Account Setting</span></a></li>
                                    <li><a href="html/user-profile-activity.html"><em className="icon ni ni-activity-alt"></em><span>Login Activity</span></a></li>
                                </ul>
                            </div>
                            <div className="dropdown-inner">
                                <ul className="link-list">
                                    <li><a href="#"><em className="icon ni ni-signout"></em><span>Sign out</span></a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar
