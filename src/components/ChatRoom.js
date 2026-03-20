import React, { useEffect, useState } from 'react'
// import { Navbar } from 'react-bootstrap'
import Navbar from './Navbar'
import ChatBox from './ChatBox'
import Chats from './Chats'
import CreateGroup2 from './CreateGroup2'
import { useLocation } from 'react-router-dom'
import EmptyChatRoom from './EmptyChatRoom'
import AddUsers from './AddUsers'
import NewChat from './NewChat'
import AllUsers from './AllUsers'
import AddCompany from './AddCompany'
import AdminChatBox from './AdminChatBox'
import AdminChats from './AdminChats'

const ChatRoom = ({shadowRoot}) => {

    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const isCreateGroup = queryParams.has('create_group');
    const isAddUser = queryParams.has('add_user');
    const isNewChat = queryParams.has('new_chat');
    const isAllUsers = queryParams.has('users');
    const isAddCompany = queryParams.has('add_company');

    const selectedUserId = queryParams.get('user');
    const selectedGroupId = queryParams.get('group');
    const selectedConversationId = queryParams.get('conversation');

    const isChatEmpty = !selectedUserId && !selectedGroupId && !isCreateGroup && !isAddUser && !isNewChat && !isAllUsers && !isAddCompany && !selectedConversationId;

    const loggedInUser = JSON.parse(localStorage.getItem('chatUserData'))

    const [convoUsers, setConvoUsers] = useState(undefined);


    return (
        <div className="nk-content p-0 mt-0 h-100">
            <div className="nk-content-inner h-100">
                <div className="nk-content-body h-100">
                    <div className="nk-chat h-100" style={{minHeight: 'unset'}}>
                        {/* Sidebar Chats */}
                        {loggedInUser?.role == '1' ? <AdminChats setConvoUsers={setConvoUsers} /> : <Chats />}

                        {/* Right-side logic */}
                        {isChatEmpty && <EmptyChatRoom />}
                        {(selectedUserId || selectedGroupId) && (
                            <ChatBox
                                userId={selectedUserId}
                                groupId={selectedGroupId}
                                shadowRoot={shadowRoot}
                            />
                        )}
                        {selectedConversationId && convoUsers && (
                            <AdminChatBox
                                conversationId={selectedConversationId}
                                convoUsers={convoUsers}
                                userId={null}
                                groupId={null}
                            />
                        )}
                        {isCreateGroup && <CreateGroup2 />}
                        {isAddUser && <AddUsers />}
                        {isNewChat && <NewChat />}
                        {isAllUsers && <AllUsers />}
                        {isAddCompany && <AddCompany /> }

                    </div>
                </div>
            </div>
        </div>
    )
}

export default ChatRoom
