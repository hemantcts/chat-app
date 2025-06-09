import React, { useEffect } from 'react'
// import { Navbar } from 'react-bootstrap'
import Navbar from './Navbar'
import ChatBox from './ChatBox'
import Chats from './Chats'
import CreateGroup2 from './CreateGroup2'
import { useLocation } from 'react-router-dom'
import EmptyChatRoom from './EmptyChatRoom'
import AddUsers from './AddUsers'
import NewChat from './NewChat'

const ChatRoom = () => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const isCreateGroup = queryParams.has('create_group');
    const isAddUser = queryParams.has('add_user');
    const isNewChat = queryParams.has('new_chat');
    const selectedUserId = queryParams.get('user');
    const selectedGroupId = queryParams.get('group');

    const isChatEmpty = !selectedUserId && !selectedGroupId && !isCreateGroup && !isAddUser && !isNewChat;


    return (
        <div className="nk-content p-0 mt-0">
            <div className="nk-content-inner">
                <div className="nk-content-body">
                    <div className="nk-chat">
                        {/* Sidebar Chats */}
                        <Chats />

                        {/* Right-side logic */}
                        {isChatEmpty && <EmptyChatRoom />}
                        {(selectedUserId || selectedGroupId) && (
                            <ChatBox
                                userId={selectedUserId}
                                groupId={selectedGroupId}
                            />
                        )}
                        {isCreateGroup && <CreateGroup2 />}
                        {isAddUser && <AddUsers />}
                        {isNewChat && <NewChat />}

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatRoom
