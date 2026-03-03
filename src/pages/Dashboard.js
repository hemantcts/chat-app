import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatRoom from '../components/ChatRoom'
import Navbar from '../components/Navbar'
import CreateGroup from '../components/CreateGroup'
import { useLocation } from 'react-router-dom'
import UserProfile from '../components/UserProfile'

const Dashboard = () => {
    // const { pathname } = useLocation();

    // const isChat = pathname === '/dashboard/chat' || pathname === '/dashboard';
    // const isCreateGroup = pathname === '/dashboard/users';
    // const isViewProfile = pathname === '/dashboard/profile';

    // const page = (() => {
    //     if (pathname === '/dashboard/chat') return '';
    //     if (pathname === '/dashboard/create_group') return 'Group';
    //     return 'Dashboard';
    // })();

    // const pageHeading = (() => {
    //     if (pathname === '/dashboard/chat') return 'Chatify - For Movers';
    //     if (pathname === '/dashboard/create_group') return 'Create Groups Here';
    //     return 'Dashboard';
    // })();

    const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

    return (
        // <div className='nk-body npc-apps apps-only has-apps-sidebar npc-apps-chat no-touch nk-nio-theme has-sidebar chat-profile-autohide h-100'>
        <div className={`nk-body npc-apps apps-only has-apps-sidebar npc-apps-chat no-touch nk-nio-theme has-sidebar chat-profile-autohide h-100 chat-container ${theme}`}>
            <div class="nk-app-root h-100">
                {/* <Sidebar /> */}
                <div className="nk-main h-100">
                    <div className="nk-wrap pt-0 h-100" style={{minHeight: 'unset'}}>
                        {/* <Navbar page={page} pageHeading={pageHeading} /> */}

                        <ChatRoom />
                        
                        {/* {isChat && <ChatRoom />}
                        {isCreateGroup && <CreateGroup />}
                        {isViewProfile && <UserProfile />} */}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
