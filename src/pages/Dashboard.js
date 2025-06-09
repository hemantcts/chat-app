import React from 'react'
import Sidebar from '../components/Sidebar'
import ChatRoom from '../components/ChatRoom'
import Navbar from '../components/Navbar'
import CreateGroup from '../components/CreateGroup'
import { useLocation } from 'react-router-dom'

const Dashboard = () => {
    const { pathname } = useLocation();

    const isChat = pathname === '/dashboard/chat' || pathname === '/dashboard';
    const isCreateGroup = pathname === '/dashboard/create_group';

    const page = (() => {
        if (pathname === '/dashboard/chat') return 'Chat';
        if (pathname === '/dashboard/create_group') return 'Group';
        return 'Dashboard';
    })();

    const pageHeading = (() => {
        if (pathname === '/dashboard/chat') return 'Chat with Friends/Family';
        if (pathname === '/dashboard/create_group') return 'Create Groups Here';
        return 'Dashboard';
    })();

    return (
        <div className='nk-body npc-apps apps-only has-apps-sidebar npc-apps-chat no-touch nk-nio-theme has-sidebar chat-profile-autohide'>
            <div class="nk-app-root">
                <Sidebar />
                <div className="nk-main ">
                    <div className="nk-wrap ">
                        <Navbar page={page} pageHeading={pageHeading} />
                        
                        {isChat && <ChatRoom />}
                        {/* {isCreateGroup && <CreateGroup />} */}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Dashboard
