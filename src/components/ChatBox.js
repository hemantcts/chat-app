import React, { useEffect, useRef, useState } from 'react'
import socket from '../utils/socket'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import InfoBar from './InfoBar';
import { useOnlineUsers } from '../context-api/OnlineUsersContext';
import { useNavigate } from 'react-router-dom';
import ConfirmModal from './ConfirmModal';
import ForwardModal from './ForwardModal';

import parse, { domToReact } from "html-react-parser";

import { EditorState, ContentState } from "draft-js";
import Editor from "draft-js-plugins-editor";
import createMentionPlugin from "@draft-js-plugins/mention";
import "@draft-js-plugins/mention/lib/plugin.css";
import "@draft-js-plugins/static-toolbar/lib/plugin.css";
import { stateToHTML } from 'draft-js-export-html';


import createToolbarPlugin from "@draft-js-plugins/static-toolbar";
import {
    BoldButton,
    ItalicButton,
    UnderlineButton
} from "@draft-js-plugins/buttons";

// const mentions = [
//     { name: "Hemant", id: "1" },
//     { name: "Raj", id: "2" },
//     { name: "Admin", id: "3" }
// ];

const mentionPlugin = createMentionPlugin();
const toolbarPlugin = createToolbarPlugin();
const { Toolbar } = toolbarPlugin;
const { MentionSuggestions } = mentionPlugin;
const plugins = [mentionPlugin, toolbarPlugin];

const ChatBox = ({ userId, groupId }) => {
    const [editorState, setEditorState] = useState(() =>
        EditorState.createEmpty()
    );
    const editorRef = useRef(null);
    
    const [open, setOpen] = useState(false);
    const [mentions, setMentions] = useState([]);
    const [suggestions, setSuggestions] = useState([]);

    const navigate = useNavigate()
    const chatPanelRef = useRef(null);

    const inputRef = useRef(null);

    const onlineUsers = useOnlineUsers();
    const [room, setRoom] = useState(null);
    const user = JSON.parse(localStorage.getItem('userData'))

    const [message, setMessage] = useState('');
    const [messageArr, setMessageArr] = useState([]);
    const [filesArr, setFilesArr] = useState([]);
    const [groupDetails, setGroupDetails] = useState(null)
    const [userDetails, setUserDetails] = useState(null)
    const [groupName, setGroupName] = useState(null)
    const [showDetails, setShowDetails] = useState(false);
    const [showUploadOptions, setShowUploadOptions] = useState(false)
    const [msgSeen, setMsgSeen] = useState(false)
    const [mySeenMessages, setMySeenMessages] = useState([])

    const [page, setPage] = useState(1);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [isLoading, setIsLoading] = useState(false);

    const [reply, setReply] = useState({});

    const loggedInUser = JSON.parse(localStorage.getItem('userData'));

    const [showModal, setShowModal] = useState(false);

    const getGroupDetails = async () => {
        let roomId = groupId;
        setRoom(roomId);
        try {
            const response = await fetch(`https://chat.quanteqsolutions.com/api/groups/${groupId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token')
                }
            });

            const data = await response.json();

            console.log('group', data)

            if (data.status) {
                setGroupDetails(data.group);
                setGroupName(data.group.name);
                getGroupMessages(roomId);
                setMentions(data?.group?.members);
                setSuggestions(data?.group?.members.filter(member => member._id !== loggedInUser._id));
            }
            else {
                // toast.error(data.message || 'error!');
                navigate('/dashboard/chat');
            }

        } catch (error) {
            // console.error('Error fetching group details:', error.message);
            navigate('/dashboard/chat');
            return null;
        }
    }

    const getGroupMessages2 = async (roomId) => {
        try {
            const response = await fetch(`https://chat.quanteqsolutions.com/api/groups/messages/${roomId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token')
                }
            });

            const data = await response.json();

            if (data.status) {
                console.log(data);
                setMessageArr(data.messages);
                socket.emit('join-room', { room: groupId })
            }
            else {
                // toast.error(data.message || 'error!');
                // navigate('/dashboard/chat');
            }

        } catch (error) {
            console.error('Error fetching group details:', error.message);
            // navigate('/dashboard/chat');
            return null;
        }
    }

    const getGroupMessages = async (roomId, currentPage = 1) => {
        try {
            setIsLoading(true);
            const response = await fetch(`https://chat.quanteqsolutions.com/api/groups/messages/${roomId}?page=${currentPage}&limit=20`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token')
                }
            });

            const data = await response.json();

            if (data.status) {

                let newArr = [];

                if (currentPage === 1) {
                    newArr = data.messages.reverse()
                    setMessageArr(newArr); // show oldest first
                    isInitialLoadRef.current = true; // first load → trigger scroll
                } else {
                    newArr = messageArr;
                    data.messages.reverse()
                    newArr = [...data.messages, ...newArr]

                    setMessageArr(newArr);
                    isInitialLoadRef.current = false; // no scroll on older load
                }

                if (data.messages.length < 20) {
                    setHasMoreMessages(false);
                } else {
                    setHasMoreMessages(true);
                }
                setMySeenMessages(newArr);
                socket.emit('join-room', { room: groupId });
            }

        } catch (error) {
            console.error('Error fetching group messages:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const getUserDetails = async () => {
        try {
            const response = await fetch(`https://chat.quanteqsolutions.com/api/user/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token')
                }
            });

            const data = await response.json();

            if (data.status) {
                console.log(data);
                setUserDetails(data.user);
                getChatMessages(data.user._id);
            }
            else {
                // toast.error(data.message || 'error!');
            }

        } catch (error) {
            console.error('Error fetching group details:', error.message);
            navigate('/dashboard/chat')
            return null;
        }
    }

    const getChatMessages2 = async (userId) => {
        let roomId = getPrivateRoomId(loggedInUser._id, userId);
        setRoom(roomId);

        try {
            const response = await fetch(`https://chat.quanteqsolutions.com/api/user/messages/${loggedInUser._id}/${userId}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token')
                }
            });

            const data = await response.json();

            if (data.status) {
                console.log(data);
                setMessageArr(data.messages);
                socket.emit('join-room', { room: roomId })
            }
            else {
                // toast.error(data.message || 'error!');
                // navigate('/dashboard/chat');
            }

        } catch (error) {
            console.error('Error fetching group details:', error.message);
            // navigate('/dashboard/chat');
            return null;
        }
    }


    const getChatMessages = async (userId, currentPage = 1) => {
        let roomId = getPrivateRoomId(loggedInUser._id, userId);
        setRoom(roomId);

        try {
            setIsLoading(true);
            const response = await fetch(`https://chat.quanteqsolutions.com/api/user/messages/${loggedInUser._id}/${userId}?page=${currentPage}&limit=20`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: localStorage.getItem('token')
                }
            });

            const data = await response.json();

            if (data.status) {
                // if (currentPage === 1) {
                //     setMessageArr(data.messages);
                // } else {
                //     // prepend older messages
                //     setMessageArr(prev => [...data.messages.reverse(), ...prev]);
                // }

                if (currentPage === 1) {
                    setMessageArr(data.messages.reverse());
                    isInitialLoadRef.current = true;
                } else {
                    data.messages.reverse()
                    setMessageArr(prev => [...data.messages, ...prev]);
                    // setMessageArr(prev => [...data.messages.slice().reverse(), ...prev]);
                    isInitialLoadRef.current = false;
                }


                if (data.messages.length < 20) {
                    setHasMoreMessages(false);
                } else {
                    setHasMoreMessages(true);
                }
                socket.emit('join-room', { room: roomId });
            }

        } catch (error) {
            console.error('Error fetching user messages:', error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const isInitialLoadRef = useRef(true);

    const [messageSent, setMessageSent] = useState(false);

    useEffect(() => {
        if (messageSent) {
            scrollToBottom();
            setMessageSent(false);
        }
        if (isInitialLoadRef.current && !isLoading) {
            scrollToBottom();
            isInitialLoadRef.current = false; // only once
        }
    }, [messageArr, isLoading, messageSent]);



    const loadOlderMessages = async () => {
        const nextPage = page + 1;
        setPage(nextPage);

        if (userId) {
            await getChatMessages(userDetails?._id, nextPage);
        } else {
            await getGroupMessages(groupId, nextPage);
        }
    };


    const handleScroll = async () => {
        const chatPanel = chatPanelRef.current;
        if (chatPanel.scrollTop === 0 && hasMoreMessages && !isLoading) {
            const previousScrollHeight = chatPanel.scrollHeight;

            await loadOlderMessages();

            // After loading, adjust scroll position
            requestAnimationFrame(() => {
                chatPanel.scrollTop = chatPanel.scrollHeight - previousScrollHeight;
            });
        }
    };


    const getPrivateRoomId = (userId1, userId2) => {
        return [userId1, userId2].sort().join('_');
    };


    useEffect(() => {
        setMessageArr([])
        setPage(1);
        setHasMoreMessages(true);
        setIsLoading(true);

        if (userId) {
            getUserDetails();
            setShowDetails(false);
        }
        else {
            getGroupDetails();
        }
    }, [groupId, userId])



    useEffect(() => {
        if (userId) {
            socket.emit('mark-seen', { chatUserId: userId });
        }
        if (groupId) {
            socket.emit('mark-seen-group', { groupId: groupId });
        }
        socket.on('messages-seen', (data) => {
            setMsgSeen(true);
        })
        socket.on('group-messages-seen', (data) => {
            // setMsgSeen(true);

            const { messages, byUserId } = data;

            // console.log("messages", messages)
            // let seenMessages = messages.filter(msg => msg?.senderId === loggedInUser?._id);
            setMySeenMessages(messages);


            // console.log(seenMessages, 'group seen members');

        })

    }, [groupId, userId, messageArr])

    const scrollToBottom2 = () => {
        const chatPanel = chatPanelRef.current;
        if (chatPanel) {
            chatPanel.scrollTo({
                top: chatPanel.scrollHeight,
                behavior: 'smooth',
            });
        }
    };

    const scrollToBottom = () => {
        const chatPanel = chatPanelRef.current;
        if (chatPanel) {
            chatPanel.scrollTop = chatPanel.scrollHeight;
        }
    };

    function getDisplayDate(index, messageArr) {
        const currentDate = messageArr[index]?.createdDate;
        const prevDate = messageArr[index - 1]?.createdDate;

        if (currentDate === prevDate) {
            return false;
        }
        return currentDate;
    }


    function getDisplayTime(index, messageArr) {
        const currentTime = messageArr[index]?.createdAt;
        const nextTime = messageArr[index + 1]?.createdAt;

        if (messageArr[index]?.receiverId !== messageArr[index + 1]?.receiverId) {
            return currentTime;
        }

        if (currentTime === nextTime) {
            return false;
        }
        return currentTime; // or return formattedCurrent if formatting
    }

    function getDisplaySeenUsers(seenMsgArr, messageArr, index, userId) {
        // const currentUser = userArr[index]?._id;
        // const nextUser = userArr[index + 1]?._id;

        if (userId?._id === loggedInUser?._id) {
            return false
        }

        // console.log(userId, loggedInUser?._id, 'here')

        let messageArrId = messageArr[index]?._id;

        // let myMessages = messageArr.filter(msg => msg?.senderDetails?.id === loggedInUser?._id)
        let myMessages = messageArr;

        // for (let i = 0; i < myMessages.length; i++) {
        //     if (myMessages[i]?._id === messageArrId) {
        //         index = i;
        //     }
        // }

        const nextMsgId = myMessages[index + 1]?._id;

        let userMessages = seenMsgArr.filter(msg => msg._id === nextMsgId)

        // console.log(userMessages, userId?._id, "testing seen")

        let flag = true;

        userMessages[0]?.groupSeen?.forEach(element => {
            if (element?.userId?._id === userId?._id) {
                flag = false;
            }
        });


        return flag;
    }

    // useEffect(() => {

    //         scrollToBottom();
    // }, [messageArr]);
    const [isTyping, setIsTyping] = useState(false);
    const [typingSender, setTypingSender] = useState(false);
    const [typingSenders, setTypingSenders] = useState([]);

    useEffect(() => {
        socket.on('show-typing', ({ senderId, senderDetails, isGroup }) => {
            if (!isGroup && senderId === userId) {
                setIsTyping(true);
                setTypingSender(senderDetails);
            }
            if (isGroup && senderId !== loggedInUser?._id) {
                setTypingSenders((prevSenders) => {
                    const alreadyExists = prevSenders.some(sender => sender.id === senderDetails.id); // or use _id based on your data
                    if (!alreadyExists) {
                        const updatedSenders = [...prevSenders, senderDetails];
                        console.log(updatedSenders, 'typing');
                        return updatedSenders;
                    }
                    return prevSenders;
                });
            }
        });

        socket.on('hide-typing', ({ senderId, isGroup }) => {
            if (!isGroup && senderId === userId) {
                setIsTyping(false);
            }
            if (isGroup && senderId !== loggedInUser?._id) {
                setTypingSenders((prevSenders) => {
                    const updatedSenders = prevSenders.filter(sender => sender.id !== senderId); // or use _id
                    console.log(updatedSenders, 'typing');
                    return updatedSenders;
                });
            }
        });

        return () => {
            socket.off('show-typing');
            socket.off('hide-typing');
        };
    }, [userId]);



    useEffect(() => {
        const handleReceiveMessage = (data) => {
            console.log('test forward', data)
            // return
            const newMessage = data.message;
            console.log(newMessage)
            setMessageArr((prevMessages) => [...prevMessages, newMessage]);
            setMessageSent(true);
        };

        const handleReceiveForwardMessage = (data) => {
            // const currentConnectedRoom = connectedRoomRef.current;
            console.log('test forward', data)

            if (true) {
                const newMessages = data.message;
                setMessageArr((prevMessages) => [...prevMessages, ...newMessages]);
            }
        }

        socket.on('receive-message', handleReceiveMessage);
        socket.on('receive-forward-message', handleReceiveForwardMessage);

        return () => {
            socket.off('receive-message', handleReceiveMessage);
            socket.off('receive-forward-message', handleReceiveForwardMessage);
        };
    }, [])


    const handleTyping = () => {
        let receiverId = room;
        let isGroup = false;
        if (groupId) {
            receiverId = groupId;
            isGroup = true;
        }
        socket.emit('typing', {
            senderId: loggedInUser._id,
            receiverId: receiverId, // or groupId
            isGroup: isGroup // or true for group chats
        });
    };

    const handleStopTyping = () => {
        let receiverId = room;
        let isGroup = false;
        if (groupId) {
            receiverId = groupId;
            isGroup = true;
        }
        socket.emit('stop-typing', {
            senderId: loggedInUser._id,
            receiverId: receiverId,
            isGroup: isGroup
        });
    };

    const typingTimeout = useRef(null);

    // On input change
    const handleChangeMessage = (event) => {
        setMessage(event.target.value);

        handleTyping();

        clearTimeout(typingTimeout.current);
        typingTimeout.current = setTimeout(() => {
            handleStopTyping();
        }, 3000);
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevents form submission if inside a form
            sendMessage();
        }
    };

    const options2 = {
        entityStyleFn: (entity) => {
            const entityType = entity.get('type').toLowerCase();
            if (entityType === 'mention') {
                const data = entity.getData();
                return {
                    element: 'a',
                    attributes: {
                        href: `mention://${data.mention?._id}`,   // 👈 custom href logic
                        class: 'mentioned',
                        contenteditable: "false",
                        "data-mention-id": data.mention?._id,
                    },
                };
            }
        },
    };


    const sendMessage = async () => {
        if (!message.trim() && filesArr.length === 0) {
            return;
        }
        setMsgSeen(false);

        let uploadedFiles = [];

        // First upload files to server
        if (filesArr.length > 0) {
            const formData = new FormData();
            filesArr.forEach((f) => {
                console.log('files', f.file)
                formData.append('files', f.file);
            });

            try {
                const res = await fetch('https://chat.quanteqsolutions.com/api/messages/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': localStorage.getItem('token'),
                    },
                    body: formData,
                });

                const data = await res.json();
                if (data.status) {
                    uploadedFiles = data.files; // array of { url, fileType, fileName, size }
                } else {
                    toast.error(data.message || 'File upload failed!');
                    return;
                }
            } catch (err) {
                console.error('File upload error:', err);
                toast.error('Error uploading files');
                return;
            }
        }


        let newMessage = {};

        if (userId) {
            newMessage = {
                senderId: user._id,
                senderDetails: {
                    id: user._id,
                    name: user.name,
                },
                receiverId: userDetails._id,
                files: uploadedFiles,
                content: message
            };
        }
        else {
            newMessage = {
                senderId: user._id,
                senderDetails: {
                    id: user._id,
                    name: user.name,
                },
                groupId: room,
                files: uploadedFiles,
                content: message
            }
        }

        if (!(Object.keys(reply).length === 0)) {
            newMessage.replyTo = reply;
        }

        // Send to socket
        socket.emit('send-message', { room, incomingMessage: newMessage });

        // Update state
        // setMessageArr((prevMessages) => [...prevMessages, newMessage]);
        setEditorState(EditorState.createEmpty());
        setMessage('');
        setFilesArr([]);
        setReply({});
        setMessageSent(true);
    }


    const [confirmModalVisible, setConfirmModalVisible] = useState(false);
    const [selectedMessages, setSelectedMessages] = useState(null);


    const showRemoveModal = (userId) => {
        setSelectedMessages(userId);
        setConfirmModalVisible(true);
    };

    const hideModal = () => {
        setConfirmModalVisible(false);
        setSelectedMessages(null);
    };

    const forwardMessage = (msg) => {
        let messages = []
        messages.push(msg)
        setSelectedMessages(messages);
        setShowModal(true);
    }

    const deleteMessages = async (id) => {

        let messageIds = []

        messageIds.push(selectedMessages);

        try {
            const response = await fetch(`https://chat.quanteqsolutions.com/api/messages/delete`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": localStorage.getItem('token')
                },
                body: JSON.stringify({ messageIds })
            });
            const data = await response.json();
            console.log("deleted messages", data);
            if (data.status) {
                const updatedMessages = messageArr.filter(
                    (msg) => !messageIds.includes(msg._id)
                );
                setMessageArr(updatedMessages);
                setSelectedMessages(null);
                hideModal();
            }
        }
        catch (error) {
            console.error(error);
        }
    }


    const handleReply = (msgId, msgContent, senderName) => {
        setReply({ msgId, msgContent, senderName });

        // console.log(msgId, msgContent, senderName)

        if (inputRef.current) {
            inputRef.current.focus();
        }
    }

    const handleFileUpload = (files) => {
        const tempFilesArr = [];

        Array.from(files).forEach((file) => {
            if (file.size > 5 * 1024 * 1024) {
                toast.error(`${file.name} exceeds 5 MB limit!`);
                return;
            }

            const type = file.type.startsWith('image')
                ? 'image'
                : file.type.startsWith('video')
                    ? 'video'
                    : 'file';

            const previewUrl = URL.createObjectURL(file);

            const fileObj = {
                file,
                previewUrl,
                type
            };

            tempFilesArr.push(fileObj);
        });

        setFilesArr((prev) => [...prev, ...tempFilesArr]);
    };


    const handleRemoveFile = (fileName) => {
        setFilesArr((prevFilesArr) =>
            prevFilesArr.filter((f) => f.file.name !== fileName)
        );
    };

    const [showingUser, setShowingUser] = useState(null)

    // const showUserSeen = (user) => {
    //     setShowingUser(user);
    // }

    const tooltipRef = useRef(null);

    const showUserSeen = (user) => {
        if (showingUser?._id === user._id) {
            setShowingUser(null); // Hide if clicking the same user again
        } else {
            setShowingUser(user);
        }
    };


    useEffect(() => {
        const handleClickOutside = (event) => {
            if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
                setShowingUser(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const markdownToHtml = (text) => {
        return text
            // Convert bold (**text** or __text__)
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/__(.*?)__/g, '<i>$1</i>')
            // Convert italic (*text* or _text_)
            .replace(/\*(.*?)\*/g, '<strong>$1</strong>')
            .replace(/_(.*?)_/g, '<i>$1</i>')
            .replace(/\/\/(.*?)\/\//g, '<u>$1</u>')
            // Convert line breaks
            .replace(/\n/g, '<br/>')
        // .replace(/<\/div>/gi, '<br/>');
    };

    const getOptions = (msg) => ({
        replace: (domNode) => {
            if (domNode.name === "a" && domNode.attribs?.href) {
                const href = domNode.attribs.href;

                return (
                    <a
                        href={href}
                        style={{
                            color: groupId ? msg?.senderDetails?.id !== loggedInUser._id ? "#1e90ff" : "unset" : "unset",
                            textDecoration: "none",
                            cursor: groupId ? "pointer" : "default",
                            fontWeight: groupId && "bold",
                        }}
                        onClick={(e) => {
                            e.preventDefault();

                            if (href.startsWith("mention://") && groupId) {
                                const userId = href.replace("mention://", "").replace("/", "");
                                console.log("Mention clicked:", userId);

                                if (userId !== loggedInUser._id) {
                                    navigate(`/dashboard/chat?user=${userId}`);
                                }
                            } else {
                                if (!href.startsWith("mention://")) {
                                    window.open(href, "_blank");
                                }
                            }
                        }}
                    >
                        {domToReact(domNode.children, getOptions(msg))}
                    </a>
                );
            }

            if (domNode.name === "b" || domNode.name === "strong") {
                return <span style={{ fontWeight: "bold" }}>{domToReact(domNode.children, getOptions(msg))}</span>;
            }

            if (domNode.name === "i") {
                return <span style={{ fontStyle: "italic" }}>{domToReact(domNode.children, getOptions(msg))}</span>;
            }

            if (domNode.name === "u") {
                return <span style={{ textDecoration: "underline" }}>{domToReact(domNode.children, getOptions(msg))}</span>;
            }
        },
    });


    const options = {
        replace: (domNode) => {
            if (domNode.name === "a" && domNode.attribs?.href) {
                const href = domNode.attribs.href;

                const userId = href.replace("mention://", "").replace("/", "");

                return (
                    <a
                        href={href}
                        style={{
                            color: "unset",
                            textDecoration: "none",
                            cursor: groupId ? "pointer" : "default",
                            fontWeight: groupId && 'bold'
                        }}
                        onClick={(e) => {
                            e.preventDefault();

                            if (href.startsWith("mention://") && groupId) {
                                const userId = href.replace("mention://", "").replace("/", "");
                                console.log("Mention clicked:", userId);

                                if (userId !== loggedInUser._id) {
                                    navigate(`/dashboard/chat?user=${userId}`);
                                }
                            } else {
                                if (!href.startsWith("mention://")) {
                                    window.open(href, "_blank");
                                }
                            }
                        }}
                    >
                        {domToReact(domNode.children, options)}
                    </a>
                );
            }

            if (domNode.name === "b" || domNode.name === "strong") {
                return (
                    <span style={{ fontWeight: "bold" }}>
                        {domToReact(domNode.children, options)}
                    </span>
                );
            }

            if (domNode.name === "i") {
                return (
                    <span style={{ fontStyle: "italic" }}>
                        {domToReact(domNode.children, options)}
                    </span>
                );
            }

            if (domNode.name === "u") {
                return (
                    <span style={{ textDecoration: "underline" }}>
                        {domToReact(domNode.children, options)}
                    </span>
                );
            }
        },
    };

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
        <>
            {groupId ? (
                <div style={{ paddingRight: showDetails && '325px' }} className={`nk-chat-body ${showDetails ? 'profile-shown' : ''}`}>
                    <div className="nk-chat-head">
                        <ul className="nk-chat-head-info">
                            <li className="nk-chat-body-close">
                                <a href="#" className="btn btn-icon btn-trigger nk-chat-hide ml-n1"><em className="icon ni ni-arrow-left"></em></a>
                            </li>
                            <li className="nk-chat-head-user">
                                <div className="user-card">

                                    {groupDetails?.groupImage ? (
                                        <div className="user-avatar bg-purple group-image" style={{ backgroundImage: `url(https://chat.quanteqsolutions.com/${groupDetails?.groupImage})` }}
                                        ></div>
                                    ) : (
                                        <div className="user-avatar bg-purple">
                                            <span>{groupDetails?.name?.slice(0, 2).toUpperCase()}</span>
                                        </div>
                                    )}

                                    {/* <div className="user-avatar bg-purple">
                                        <span>{groupDetails?.name?.slice(0, 2).toUpperCase()}</span>
                                    </div> */}
                                    <div className="user-info">
                                        <div className="lead-text">{groupDetails?.name}</div>
                                        <div className="sub-text"><span className="d-none d-sm-inline mr-1">members : </span>{groupDetails?.members?.length}</div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <ul className="nk-chat-head-tools">
                            {/* <li><a href="#" className="btn btn-icon btn-trigger text-primary"><em className="icon ni ni-call-fill"></em></a></li>
                            <li><a href="#" className="btn btn-icon btn-trigger text-primary"><em className="icon ni ni-video-fill"></em></a></li>
                            <li className="d-none d-sm-block">
                                <div className="dropdown">
                                    <a href="#" className="dropdown-toggle btn btn-icon btn-trigger text-primary" data-bs-toggle="dropdown"><em className="icon ni ni-setting-fill"></em></a>
                                    <div className="dropdown-menu dropdown-menu-right">
                                        <ul className="link-list-opt no-bdr">
                                            <li><a className="dropdown-item" href="#"><em className="icon ni ni-archive"></em><span>Make as Archive</span></a></li>
                                            <li><a className="dropdown-item" href="#"><em className="icon ni ni-cross-c"></em><span>Remove Conversion</span></a></li>
                                            <li><a className="dropdown-item" href="#"><em className="icon ni ni-setting"></em><span>More Options</span></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </li> */}
                            <li className="mr-n1 mr-md-n2"><button className={`btn btn-icon btn-trigger text-primary chat-profile-toggle ${showDetails ? 'active' : ''}`} onClick={() => setShowDetails(!showDetails)}><em className="icon ni ni-alert-circle-fill"></em></button></li>
                        </ul>
                        <div className="nk-chat-head-search">
                            <div className="form-group">
                                <div className="form-control-wrap">
                                    <div className="form-icon form-icon-left">
                                        <em className="icon ni ni-search"></em>
                                    </div>
                                    <input type="text" className="form-control form-round" id="chat-search" placeholder="Search in Conversation" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="nk-chat-panel main-chat-box" ref={chatPanelRef} onScroll={handleScroll} data-simplebar>

                        {isLoading && (
                            <div style={{ textAlign: 'center', paddingBottom: '1rem', width: '100%' }}>
                                <span className="spinner-border spinner-border-sm"></span>
                            </div>
                        )}
                        {messageArr.map((msg, index) => (
                            <div key={index} className='chat' style={{ display: 'block' }}>

                                {getDisplayDate(index, messageArr) && <div className="msg-date text-center">{getDisplayDate(index, messageArr)}</div>}

                                <div className={`chat ${msg?.senderDetails?.id === loggedInUser._id ? 'is-me' : 'is-you'}`}>
                                    {/* <div key={index} className={`chat ${false ? 'is-me' : 'is-you'}`}> */}
                                    {/* {msg?.senderDetails?.id !== loggedInUser._id && <div className="chat-avatar"> */}
                                    {msg?.senderDetails?.id !== loggedInUser._id && <div className={`chat-avatar ${getDisplayTime(index, messageArr) ? '' : 'mb-0'}`}>
                                        <div className="user-avatar bg-purple" style={{ backgroundImage: `url(https://chat.quanteqsolutions.com${msg?.senderDetails?.imagePath})` }}>
                                            {!msg?.senderDetails?.imagePath && <span>{msg?.senderDetails?.name?.slice(0, 2).toUpperCase()}</span>}
                                            {/* <span>he</span> */}
                                        </div>
                                    </div>}
                                    <div className="chat-content">
                                        {/* <div className="sender">
                                            is-you
                                        </div> */}

                                        {msg?.senderDetails?.id !== loggedInUser?._id && <ul className="chat-meta">
                                            <li >{msg?.senderDetails?.name}</li>
                                        </ul>}

                                        {msg?.senderDetails?.id === loggedInUser._id ? (
                                            msg?.replyTo && <ul className="chat-meta mt-0 mb-1">
                                                <li>{msg?.replyTo?.time}</li>
                                                <li>{`replied to ${msg?.replyTo?.senderName !== loggedInUser?.name ? msg?.replyTo?.senderName : 'yourself'}`}</li>
                                            </ul>
                                        ) : (
                                            msg?.replyTo && <ul className="chat-meta mt-0 mb-1">
                                                <li>{`replied to ${msg?.replyTo?.senderName !== loggedInUser?.name ? 'themselves' : 'you'}`}</li>
                                                <li>{msg?.replyTo?.time}</li>
                                            </ul>
                                        )
                                        }

                                        <div className="chat-bubbles">
                                            {msg?.senderDetails?.id === loggedInUser._id ? (
                                                msg?.replyTo && <div className="chat-bubble my-reply-bubble">
                                                    <div className="chat-msg reply-chat-msg"> {parse(truncateHtml(msg?.replyTo?.msgContent || "", 20))} </div>
                                                </div>
                                            ) : (
                                                msg?.replyTo && <div className="chat-bubble user-reply-bubble">
                                                    <div className="chat-msg reply-chat-msg"> {parse(truncateHtml(msg?.replyTo?.msgContent || "", 20))} </div>
                                                </div>
                                            )
                                            }
                                            {msg.files && msg.files.length > 0 && <div className="chat-bubble">
                                                {/* Files preview */}
                                                {msg.files && msg.files.length > 0 && (
                                                    <div className={`message-files ${msg?.senderDetails?.id === loggedInUser._id ? 'text-end' : 'text-start'}`}>
                                                        {msg.files.map((f, index) => {
                                                            if (f.fileType === 'image') {
                                                                return (
                                                                    <div className='inner-file'>
                                                                        <img
                                                                            key={index}
                                                                            src={`https://chat.quanteqsolutions.com${f.url}`}
                                                                            alt={f.fileName}
                                                                            style={{ margin: '5px', maxWidth: '200px', maxHeight: '200px' }}
                                                                        />
                                                                    </div>
                                                                );
                                                            } else if (f.fileType === 'video') {
                                                                return (
                                                                    <div className="inner-file">
                                                                        <video
                                                                            key={index}
                                                                            src={`https://chat.quanteqsolutions.com${f.url}`}
                                                                            controls
                                                                            style={{ margin: '5px', maxWidth: '300px', maxHeight: '300px' }}
                                                                        ></video>
                                                                    </div>
                                                                );
                                                            } else {
                                                                return (
                                                                    <div className='inner-file' style={{ border: '1px solid rgb(204, 204, 204)', margin: '5px', padding: '5px' }} key={index}>
                                                                        <a
                                                                            href={`https://chat.quanteqsolutions.com${f.url}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            style={{ display: 'block' }}
                                                                        >
                                                                            📄 {f.fileName}
                                                                        </a>
                                                                    </div>
                                                                );
                                                            }
                                                        })}
                                                    </div>
                                                )}

                                                {/* <ul className="chat-msg-more">
                                                <li className="d-none d-sm-block"><button className="btn btn-icon btn-sm btn-trigger" onClick={() => handleReply(msg?._id, msg?.content, msg?.senderDetails?.name)}><em className="icon ni ni-reply-fill"></em></button></li>
                                                <li>
                                                    <div className="dropdown">
                                                        <a href="#" className="btn btn-icon btn-sm btn-trigger dropdown-toggle" data-bs-toggle="dropdown"><em className="icon ni ni-more-h"></em></a>
                                                        <div className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                                                            <ul className="link-list-opt no-bdr">
                                                                <li className="d-sm-none"><a href="#"><em className="icon ni ni-reply-fill"></em> Reply</a></li>
                                                                <li><a href="#"><em className="icon ni ni-pen-alt-fill"></em> Edit</a></li>
                                                                <li><a href="#"><em className="icon ni ni-trash-fill"></em> Remove</a></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul> */}

                                            </div>}
                                            {msg?.content && <div className="chat-bubble">


                                                <div className="chat-msg">
                                                    {msg?.isForwarded && <ul className="chat-meta mb-1" style={{ justifyContent: 'flex-start' }}>
                                                        <li style={{ padding: '0 0.7rem', borderRadius: '25px', fontSize: '10px', backgroundColor: msg?.senderDetails?.id === loggedInUser._id ? '#fff' : '#3883F9', color: msg?.senderDetails?.id === loggedInUser._id ? '#3883F9' : '#fff' }}>Forwarded</li>
                                                    </ul>}
                                                    {parse(markdownToHtml(msg?.content) || "", getOptions(msg))}
                                                </div>
                                                <ul className="chat-msg-more">
                                                    <li className="d-none d-sm-block"><button className="btn btn-icon btn-sm btn-trigger" onClick={() => handleReply(msg?._id, msg?.content, msg?.senderDetails?.name)}><em className="icon ni ni-reply-fill"></em></button></li>

                                                    <li className="d-none d-sm-block"><button className="btn btn-icon btn-sm btn-trigger" onClick={() => forwardMessage(msg)}><em className="icon ni ni-share-fill"></em></button></li>

                                                    <li className="d-none d-sm-block"><button className="btn btn-icon btn-sm btn-trigger" onClick={() => showRemoveModal(msg?._id)}><em className="icon ni ni-trash-fill"></em></button></li>
                                                    {/* <li>
                                                    <div className="dropdown">
                                                        <a href="#" className="btn btn-icon btn-sm btn-trigger dropdown-toggle" data-bs-toggle="dropdown"><em className="icon ni ni-more-h"></em></a>
                                                        <div className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                                                            <ul className="link-list-opt no-bdr">
                                                                <li className="d-sm-none"><a href="#"><em className="icon ni ni-reply-fill"></em> Reply</a></li>
                                                                <li><a href="#"><em className="icon ni ni-pen-alt-fill"></em> Edit</a></li>
                                                                <li><a href="#"><em className="icon ni ni-trash-fill"></em> Remove</a></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li> */}
                                                </ul>
                                            </div>}
                                        </div>
                                        {getDisplayTime(index, messageArr) && <ul className="chat-meta">
                                            {/* <li>{msg?.senderDetails?.name}</li> */}
                                            <li>
                                                {getDisplayTime(index, messageArr) && getDisplayTime(index, messageArr)}
                                                {/* {(index === messageArr.length - 1 && msg?.senderDetails?.id === loggedInUser?._id) && <em className={`icon ni ni-check-circle-fill ms-1 ${(msg?.seen || msgSeen) ? 'message-seen' : ''}`}></em> } 
                                            {(index === messageArr.length - 1 && msg?.senderDetails?.id === loggedInUser?._id) && <span>{(msg?.seen || msgSeen) ? 'seen' : 'sent'}</span> }  */}
                                            </li>
                                        </ul>}

                                        {/* <ul className="chat-meta">
                                        <li>{msg?.senderDetails?.name}</li>
                                        <li>{msg?.createdAt} <em className="icon ni ni-check-circle-fill"></em></li>
                                    </ul> */}
                                    </div>
                                </div>


                                {true && <ul className="chat-meta chat-seen-meta mt-0 justify-content-end">
                                    {mySeenMessages.map((seenMsg) => (
                                        seenMsg?._id === msg?._id && (
                                            seenMsg?.groupSeen?.filter(seen => seen.userId._id !== loggedInUser._id).map((user, i) => {
                                                const isCurrentUser = showingUser?._id === user?.userId?._id;
                                                return (user?.userId && getDisplaySeenUsers(mySeenMessages, messageArr, index, user?.userId)) && (
                                                    <li key={i} ref={isCurrentUser ? tooltipRef : null}>
                                                        {/* <button
                                                            onClick={() => showUserSeen(user?.userId)}
                                                            className="user-avatar user-seen-avatar bg-purple border-0"
                                                            style={{ backgroundImage: `url(https://chat.quanteqsolutions.com${user?.userId?.imagePath})` }}
                                                        >
                                                            {!user?.userId?.imagePath && <span>{user?.userId?.name?.slice(0, 2).toUpperCase()}</span>}
                                                        </button> */}

                                                        <span>{i === 0 ? 'seen by' : ''} {user?.userId?.name}{i !== seenMsg?.groupSeen?.filter(seen => seen.userId._id !== loggedInUser?._id).length - 1 && seenMsg?.groupSeen?.filter(seen => seen.userId._id !== loggedInUser?._id).length > 1 ? ',' : ''} </span>

                                                        {/* {isCurrentUser && (
                                                            <div className="users_detail">
                                                                {showingUser?.name}
                                                            </div>
                                                        )} */}
                                                    </li>
                                                );
                                            })
                                        )
                                    ))}

                                </ul>}
                            </div>
                        ))}

                        {typingSenders.length > 0 && <div>
                            {typingSenders.map((typingSender, index) => (
                                <div key={index} className="chat is-you">
                                    <div className={`chat-avatar mb-0`}>
                                        <div className="user-avatar bg-purple">
                                            <span>{typingSender?.name?.slice(0, 2).toUpperCase()}</span>
                                            {/* <span>qw</span> */}
                                        </div>
                                    </div>
                                    <div className="chat-content">
                                        <div className="chat-bubbles">
                                            <ul className="chat-meta">
                                                <li>{typingSender?.name}</li>
                                            </ul>
                                            <div className="chat-bubble">
                                                {/* <div className="chat-msg"> Thanks for inform. We just solved the issues. Please check now. </div> */}
                                                <div className="chat-msg">
                                                    <div className="typing">
                                                        <div className="dot"></div>
                                                        <div className="dot"></div>
                                                        <div className="dot"></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}

                        </div>}
                    </div>

                    {!(Object.keys(reply).length === 0) && <div className="reply position-relative">
                        <div className='reply-sender'>Replying to <span style={{ fontWeight: '500' }}>{reply?.senderName !== loggedInUser?.name ? reply?.senderName : 'yourself'}</span></div>
                        <div className="reply-message">
                            {parse(truncateHtml(reply?.msgContent || "", 20))}
                        </div>

                        <button className='btn btn-icon btn-sm btn-trigger position-absolute' style={{ top: '0.7rem', right: '1.25rem' }} onClick={() => setReply({})}>
                            <svg className="svg-icon" style={{ width: '1em', height: '1em', verticalAlign: 'middle', fill: 'currentColor', overflow: 'hidden', }} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <path d="M810.65984 170.65984q18.3296 0 30.49472 12.16512t12.16512 30.49472q0 18.00192-12.32896 30.33088l-268.67712 268.32896 268.67712 268.32896q12.32896 12.32896 12.32896 30.33088 0 18.3296-12.16512 30.49472t-30.49472 12.16512q-18.00192 0-30.33088-12.32896l-268.32896-268.67712-268.32896 268.67712q-12.32896 12.32896-30.33088 12.32896-18.3296 0-30.49472-12.16512t-12.16512-30.49472q0-18.00192 12.32896-30.33088l268.67712-268.32896-268.67712-268.32896q-12.32896-12.32896-12.32896-30.33088 0-18.3296 12.16512-30.49472t30.49472-12.16512q18.00192 0 30.33088 12.32896l268.32896 268.67712 268.32896-268.67712q12.32896-12.32896 30.33088-12.32896z" />
                            </svg>
                        </button>
                    </div>}

                    {filesArr.length > 0 && (
                        <div className="file-preview-container" style={{ display: 'flex', gap: '10px', padding: '1rem 1.25rem' }}>
                            {filesArr.map((f, index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                    {f.type === 'image' && (
                                        <img src={f.previewUrl} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'fill' }} />
                                    )}
                                    {f.type === 'video' && (
                                        <video src={f.previewUrl} controls style={{ width: '120px', height: '80px' }} />
                                    )}
                                    {f.type === 'file' && (
                                        <div style={{ padding: '10px', border: '1px solid #ccc' }}>
                                            <span>{f.file.name}</span>
                                        </div>
                                    )}


                                    <button className='btn btn-icon btn-sm btn-trigger border-0 position-absolute' style={{ top: '0', right: '0', backgroundColor: '#6576ff', color: '#fff', padding: '2px 1px' }} onClick={() => handleRemoveFile(f.file.name)} >
                                        <svg className="svg-icon" style={{ width: '1em', height: '1em', verticalAlign: 'middle', fill: 'currentColor', overflow: 'hidden', }} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M810.65984 170.65984q18.3296 0 30.49472 12.16512t12.16512 30.49472q0 18.00192-12.32896 30.33088l-268.67712 268.32896 268.67712 268.32896q12.32896 12.32896 12.32896 30.33088 0 18.3296-12.16512 30.49472t-30.49472 12.16512q-18.00192 0-30.33088-12.32896l-268.32896-268.67712-268.32896 268.67712q-12.32896 12.32896-30.33088 12.32896-18.3296 0-30.49472-12.16512t-12.16512-30.49472q0-18.00192 12.32896-30.33088l268.67712-268.32896-268.67712-268.32896q-12.32896-12.32896-12.32896-30.33088 0-18.3296 12.16512-30.49472t30.49472-12.16512q18.00192 0 30.33088 12.32896l268.32896 268.67712 268.32896-268.67712q12.32896-12.32896 30.33088-12.32896z" />
                                        </svg>
                                    </button>
                                </div>
                            ))}

                        </div>
                    )}

                    <div className="nk-chat-editor">
                        <div className="nk-chat-editor-upload  ml-n1">
                            {/* <button onClick={() => setShowUploadOptions(!showUploadOptions)} className="btn btn-sm btn-icon btn-trigger text-primary toggle-opt" data-bs-target="chat-upload"><em className="icon ni ni-plus-circle-fill"></em></button> */}

                            <button className="btn btn-sm btn-icon btn-trigger text-primary toggle-opt" >
                                <label className="upload-files m-0 d-flex" style={{ cursor: 'pointer' }}>
                                    <em className="icon ni ni-plus-circle-fill"></em>
                                    <input
                                        type="file"
                                        multiple
                                        style={{ display: 'none' }}
                                        onChange={(e) => { handleFileUpload(e.target.files) }}
                                    />
                                </label>

                            </button>

                            {showUploadOptions && <div className="chat-upload-option" data-content="chat-upload">
                                <ul>
                                    <li>
                                        <label className="upload-files" style={{ cursor: 'pointer' }}>
                                            <em className="icon ni ni-img-fill"></em>
                                            <input
                                                type="file"
                                                multiple
                                                style={{ display: 'none' }}
                                                onChange={(e) => { handleFileUpload(e.target.files) }}
                                            />
                                        </label>
                                    </li>
                                    {/* <li><a href="#"><em className="icon ni ni-camera-fill"></em></a></li>
                                    <li><a href="#"><em className="icon ni ni-mic"></em></a></li>
                                    <li><a href="#"><em className="icon ni ni-grid-sq"></em></a></li> */}
                                </ul>
                            </div>}
                        </div>
                        <div className="nk-chat-editor-form">
                            <div className="form-control-wrap">
                                <div className='py-1'>
                                    {/* <Toolbar>
                                        {(externalProps) => (
                                            <>
                                                <BoldButton {...externalProps} />
                                                <ItalicButton {...externalProps} />
                                                <UnderlineButton {...externalProps} />
                                            </>
                                        )}
                                    </Toolbar> */}
                                    <Editor
                                        ref={editorRef}
                                        editorState={editorState}
                                        onChange={(newState) => {
                                            setEditorState(newState);

                                            // Convert editor content to HTML on every change
                                            const contentState = newState.getCurrentContent();
                                            let html = stateToHTML(contentState, options2); // 👈 options explained below
                                            html = html.replaceAll("<p>", "<div>").replaceAll("</p>", "</div>");

                                            setMessage(html); // ✅ always update HTML message
                                        }}
                                        plugins={plugins}
                                        handleReturn={(e) => {
                                            // Prevent new line, send message instead
                                            if (!e.shiftKey) {
                                                e.preventDefault();
                                                sendMessage(); // 👈 call your send function here

                                                // 👇 reset editor state to empty after sending
                                                const newEditorState = EditorState.push(
                                                    editorState,
                                                    ContentState.createFromText("") // empty editor
                                                );
                                                setEditorState(newEditorState);

                                                // 👇 force focus back to editor
                                                setTimeout(() => {
                                                    if (editorRef.current) {
                                                        editorRef.current.focus();
                                                    }
                                                }, 0);

                                                return "handled";
                                            }
                                            return "not-handled"; // allow shift+enter for new line
                                        }}
                                    />
                                    <MentionSuggestions
                                        open={open}
                                        onOpenChange={setOpen}
                                        suggestions={suggestions}
                                        onSearchChange={({ value }) => {
                                            setSuggestions(
                                                mentions.filter((m) =>
                                                    m.name.toLowerCase().includes(value.toLowerCase())
                                                )
                                            );
                                        }}
                                    />
                                </div>
                            </div>
                        </div>
                        <ul className="nk-chat-editor-tools g-2">
                            {/* <li>
                                <a href="#" className="btn btn-sm btn-icon btn-trigger text-primary"><em className="icon ni ni-happyf-fill"></em></a>
                            </li> */}
                            <li>
                                <button className="btn btn-round btn-primary btn-icon" onClick={sendMessage}><em className="icon ni ni-send-alt"></em></button>
                            </li>
                        </ul>
                    </div>

                    {groupDetails && <InfoBar showDetails={showDetails} setShowDetails={setShowDetails} groupDetails={groupDetails} groupName={groupName} setGroupName={setGroupName} getGroupDetails={getGroupDetails} onlineUsers={onlineUsers} />}
                </div>
            ) : (
                <div style={{ paddingRight: showDetails && '325px' }} className={`nk-chat-body ${showDetails ? 'profile-shown' : ''}`}>
                    <div className="nk-chat-head">
                        <ul className="nk-chat-head-info">
                            <li className="nk-chat-body-close">
                                <a href="#" className="btn btn-icon btn-trigger nk-chat-hide ml-n1"><em className="icon ni ni-arrow-left"></em></a>
                            </li>
                            <li className="nk-chat-head-user">
                                <div className="user-card">
                                    <div className="user-avatar bg-purple" style={{ backgroundImage: `url(https://chat.quanteqsolutions.com${userDetails?.imagePath})` }}>
                                        {!userDetails?.imagePath && <span>{userDetails?.name?.slice(0, 2).toUpperCase()}</span>}
                                    </div>
                                    <div className="user-info">
                                        <div className="lead-text">{userDetails?.name}</div>
                                        <div className="sub-text">
                                            <span className="d-none d-sm-inline mr-1">
                                                {onlineUsers[userDetails?._id] ? 'online' : 'offline'}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </li>
                        </ul>
                        <ul className="nk-chat-head-tools">
                            {/* <li><a href="#" className="btn btn-icon btn-trigger text-primary"><em className="icon ni ni-call-fill"></em></a></li>
                            <li><a href="#" className="btn btn-icon btn-trigger text-primary"><em className="icon ni ni-video-fill"></em></a></li>
                            <li className="d-none d-sm-block">
                                <div className="dropdown">
                                    <a href="#" className="dropdown-toggle btn btn-icon btn-trigger text-primary" data-bs-toggle="dropdown"><em className="icon ni ni-setting-fill"></em></a>
                                    <div className="dropdown-menu dropdown-menu-right">
                                        <ul className="link-list-opt no-bdr">
                                            <li><a className="dropdown-item" href="#"><em className="icon ni ni-archive"></em><span>Make as Archive</span></a></li>
                                            <li><a className="dropdown-item" href="#"><em className="icon ni ni-cross-c"></em><span>Remove Conversion</span></a></li>
                                            <li><a className="dropdown-item" href="#"><em className="icon ni ni-setting"></em><span>More Options</span></a></li>
                                        </ul>
                                    </div>
                                </div>
                            </li> */}
                            {/* <li className="mr-n1 mr-md-n2"><button className={`btn btn-icon btn-trigger text-primary chat-profile-toggle ${showDetails ? 'active' : ''}`} onClick={() => setShowDetails(!showDetails)}><em className="icon ni ni-alert-circle-fill"></em></button></li> */}
                        </ul>
                        <div className="nk-chat-head-search">
                            <div className="form-group">
                                <div className="form-control-wrap">
                                    <div className="form-icon form-icon-left">
                                        <em className="icon ni ni-search"></em>
                                    </div>
                                    <input type="text" className="form-control form-round" id="chat-search" placeholder="Search in Conversation" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="nk-chat-panel main-chat-box" ref={chatPanelRef} onScroll={handleScroll} data-simplebar>

                        {isLoading && (
                            <div style={{ textAlign: 'center', paddingBottom: '1rem', width: '100%' }}>
                                <span className="spinner-border spinner-border-sm"></span>
                            </div>
                        )}
                        {messageArr.map((msg, index) => (
                            <div key={index} className='chat' style={{ display: 'block' }}>

                                {getDisplayDate(index, messageArr) && <div className="msg-date text-center">{getDisplayDate(index, messageArr)}</div>}

                                <div className={`chat ${msg?.senderDetails?.id === loggedInUser._id ? 'is-me' : 'is-you'}`}>

                                    {/* <div key={index} className={`chat ${false ? 'is-me' : 'is-you'}`}> */}
                                    {msg?.senderDetails?.id !== loggedInUser._id && <div className={`chat-avatar ${getDisplayTime(index, messageArr) ? '' : 'mb-0'}`}>
                                        <div className="user-avatar bg-purple" style={{ backgroundImage: `url(https://chat.quanteqsolutions.com${msg?.senderDetails?.imagePath})` }}>
                                            {!msg?.senderDetails?.imagePath && <span>{msg?.senderDetails?.name?.slice(0, 2).toUpperCase()}</span>}
                                            {/* <span>he</span> */}
                                        </div>
                                    </div>}


                                    <div className="chat-content pt-0">

                                        {msg?.senderDetails?.id !== loggedInUser?._id && <ul className="chat-meta">
                                            <li >{msg?.senderDetails?.name}</li>
                                        </ul>}

                                        {msg?.senderDetails?.id === loggedInUser._id ? (
                                            msg?.replyTo && <ul className="chat-meta mt-0 mb-1">
                                                <li>{msg?.replyTo?.time}</li>
                                                <li>{`replied to ${msg?.replyTo?.senderName !== loggedInUser?.name ? msg?.replyTo?.senderName : 'yourself'}`}</li>
                                            </ul>
                                        ) : (
                                            msg?.replyTo && <ul className="chat-meta mt-0 mb-1">
                                                <li>{`replied to ${msg?.replyTo?.senderName !== loggedInUser?.name ? 'themselves' : 'you'}`}</li>
                                                <li>{msg?.replyTo?.time}</li>
                                            </ul>
                                        )
                                        }
                                        <div className="chat-bubbles">
                                            {msg?.senderDetails?.id === loggedInUser._id ? (
                                                msg?.replyTo && <div className="chat-bubble my-reply-bubble">
                                                    <div className="chat-msg reply-chat-msg">
                                                        {parse(truncateHtml(msg?.replyTo?.msgContent || "", 20))}
                                                    </div>
                                                </div>
                                            ) : (
                                                msg?.replyTo && <div className="chat-bubble user-reply-bubble">
                                                    <div className="chat-msg reply-chat-msg"> {parse(truncateHtml(msg?.replyTo?.msgContent || "", 20))} </div>
                                                </div>
                                            )
                                            }
                                            {msg.files && msg.files.length > 0 && <div className="chat-bubble">
                                                {/* Files preview */}
                                                {msg.files && msg.files.length > 0 && (
                                                    <div className={`message-files ${msg?.senderDetails?.id === loggedInUser._id ? 'text-end' : 'text-start'}`}>
                                                        {msg.files.map((f, index) => {
                                                            if (f.fileType === 'image') {
                                                                return (
                                                                    <div className='inner-file'>
                                                                        <img
                                                                            key={index}
                                                                            src={`https://chat.quanteqsolutions.com${f.url}`}
                                                                            alt={f.fileName}
                                                                            style={{ margin: '5px', maxWidth: '200px', maxHeight: '200px' }}
                                                                        />
                                                                    </div>
                                                                );
                                                            } else if (f.fileType === 'video') {
                                                                return (
                                                                    <div className="inner-file">
                                                                        <video
                                                                            key={index}
                                                                            src={`https://chat.quanteqsolutions.com${f.url}`}
                                                                            controls
                                                                            style={{ margin: '5px', maxWidth: '300px', maxHeight: '300px' }}
                                                                        ></video>
                                                                    </div>
                                                                );
                                                            } else {
                                                                return (
                                                                    <div className='inner-file' style={{ border: '1px solid rgb(204, 204, 204)', margin: '5px', padding: '5px' }} key={index}>
                                                                        <a
                                                                            href={`https://chat.quanteqsolutions.com${f.url}`}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            style={{ display: 'block' }}
                                                                        >
                                                                            📄 {f.fileName}
                                                                        </a>
                                                                    </div>
                                                                );
                                                            }
                                                        })}
                                                    </div>
                                                )}

                                                {/* <ul className="chat-msg-more">
                                                <li className="d-none d-sm-block"><button className="btn btn-icon btn-sm btn-trigger" onClick={() => handleReply(msg?._id, msg?.content, msg?.senderDetails?.name)}><em className="icon ni ni-reply-fill"></em></button></li>
                                                <li>
                                                    <div className="dropdown">
                                                        <a href="#" className="btn btn-icon btn-sm btn-trigger dropdown-toggle" data-bs-toggle="dropdown"><em className="icon ni ni-more-h"></em></a>
                                                        <div className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                                                            <ul className="link-list-opt no-bdr">
                                                                <li className="d-sm-none"><a href="#"><em className="icon ni ni-reply-fill"></em> Reply</a></li>
                                                                <li><a href="#"><em className="icon ni ni-pen-alt-fill"></em> Edit</a></li>
                                                                <li><a href="#"><em className="icon ni ni-trash-fill"></em> Remove</a></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li>
                                            </ul> */}

                                            </div>}
                                            {msg?.content && <div className="chat-bubble p-0">
                                                <div className="chat-msg">
                                                    {msg?.isForwarded && <ul className="chat-meta mb-1" style={{ justifyContent: 'flex-start' }}>
                                                        <li style={{ padding: '0 0.7rem', borderRadius: '25px', fontSize: '10px', backgroundColor: msg?.senderDetails?.id === loggedInUser._id ? '#fff' : '#3883F9', color: msg?.senderDetails?.id === loggedInUser._id ? '#3883F9' : '#fff' }}>Forwarded</li>
                                                    </ul>}
                                                    {parse(markdownToHtml(msg?.content) || "", options)}
                                                </div>


                                                <ul className="chat-msg-more">
                                                    <li className="d-none d-sm-block"><button className="btn btn-icon btn-sm btn-trigger" onClick={() => handleReply(msg?._id, msg?.content, msg?.senderDetails?.name)}><em className="icon ni ni-reply-fill"></em></button></li>

                                                    <li className="d-none d-sm-block"><button className="btn btn-icon btn-sm btn-trigger" onClick={() => forwardMessage(msg)}><em className="icon ni ni-share-fill"></em></button></li>

                                                    <li className="d-none d-sm-block"><button className="btn btn-icon btn-sm btn-trigger" onClick={() => showRemoveModal(msg?._id)}><em className="icon ni ni-trash-fill"></em></button></li>
                                                    {/* <li>
                                                    <div className="dropdown">
                                                        <a href="#" className="btn btn-icon btn-sm btn-trigger dropdown-toggle" data-bs-toggle="dropdown"><em className="icon ni ni-more-h"></em></a>
                                                        <div className="dropdown-menu dropdown-menu-sm dropdown-menu-right">
                                                            <ul className="link-list-opt no-bdr">
                                                                <li className="d-sm-none"><a href="#"><em className="icon ni ni-reply-fill"></em> Reply</a></li>
                                                                <li><a href="#"><em className="icon ni ni-pen-alt-fill"></em> Edit</a></li>
                                                                <li><a href="#"><em className="icon ni ni-trash-fill"></em> Remove</a></li>
                                                            </ul>
                                                        </div>
                                                    </div>
                                                </li> */}
                                                </ul>
                                            </div>}
                                        </div>
                                        {getDisplayTime(index, messageArr) && <ul className="chat-meta">
                                            {/* <li>{msg?.senderDetails?.name}</li> */}
                                            <li>
                                                {getDisplayTime(index, messageArr) && getDisplayTime(index, messageArr)}
                                                {(index === messageArr.length - 1 && msg?.senderDetails?.id === loggedInUser?._id) && <em className={`icon ni ni-check-circle-fill ms-1 ${(msg?.seen || msgSeen) ? 'message-seen' : ''}`}></em>}
                                                {(index === messageArr.length - 1 && msg?.senderDetails?.id === loggedInUser?._id) && <span>{(msg?.seen || msgSeen) ? 'seen' : 'sent'}</span>}
                                            </li>
                                        </ul>}
                                    </div>
                                </div>
                            </div>
                        ))}
                        {isTyping && <div className="chat is-you">
                            <div className={`chat-avatar mb-0`}>
                                <div className="user-avatar bg-purple" style={{ backgroundImage: `url(https://chat.quanteqsolutions.com${typingSender?.imagePath})` }}>
                                    {!typingSender?.imagePath && <span>{typingSender?.name?.slice(0, 2).toUpperCase()}</span>}
                                </div>
                            </div>
                            <div className="chat-content">
                                <div className="chat-bubbles">
                                    <ul className="chat-meta">
                                        <li>{typingSender?.name}</li>
                                    </ul>
                                    <div className="chat-bubble">
                                        {/* <div className="chat-msg"> Thanks for inform. We just solved the issues. Please check now. </div> */}
                                        <div className="chat-msg">
                                            <div className="typing">
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                                <div className="dot"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>}
                    </div>

                    {!(Object.keys(reply).length === 0) && <div className="reply position-relative">
                        <div className='reply-sender'>Replying to <span style={{ fontWeight: '500' }}>{reply?.senderName !== loggedInUser?.name ? reply?.senderName : 'yourself'}</span></div>
                        <div className="reply-message">
                            {parse(truncateHtml(reply?.msgContent || "", 20))}
                        </div>

                        <button className='btn btn-icon btn-sm btn-trigger position-absolute' style={{ top: '0.7rem', right: '1.25rem' }} onClick={() => setReply({})}>
                            <svg className="svg-icon" style={{ width: '1em', height: '1em', verticalAlign: 'middle', fill: 'currentColor', overflow: 'hidden', }} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                <path d="M810.65984 170.65984q18.3296 0 30.49472 12.16512t12.16512 30.49472q0 18.00192-12.32896 30.33088l-268.67712 268.32896 268.67712 268.32896q12.32896 12.32896 12.32896 30.33088 0 18.3296-12.16512 30.49472t-30.49472 12.16512q-18.00192 0-30.33088-12.32896l-268.32896-268.67712-268.32896 268.67712q-12.32896 12.32896-30.33088 12.32896-18.3296 0-30.49472-12.16512t-12.16512-30.49472q0-18.00192 12.32896-30.33088l268.67712-268.32896-268.67712-268.32896q-12.32896-12.32896-12.32896-30.33088 0-18.3296 12.16512-30.49472t30.49472-12.16512q18.00192 0 30.33088 12.32896l268.32896 268.67712 268.32896-268.67712q12.32896-12.32896 30.33088-12.32896z" />
                            </svg>
                        </button>
                    </div>}

                    {filesArr.length > 0 && (
                        <div className="file-preview-container" style={{ display: 'flex', gap: '10px', padding: '1rem 1.25rem' }}>
                            {filesArr.map((f, index) => (
                                <div key={index} style={{ position: 'relative' }}>
                                    {f.type === 'image' && (
                                        <img src={f.previewUrl} alt="preview" style={{ width: '80px', height: '80px', objectFit: 'fill' }} />
                                    )}
                                    {f.type === 'video' && (
                                        <video src={f.previewUrl} controls style={{ width: '120px', height: '80px' }} />
                                    )}
                                    {f.type === 'file' && (
                                        <div style={{ padding: '10px', border: '1px solid #ccc' }}>
                                            <span>{f.file.name}</span>
                                        </div>
                                    )}


                                    <button className='btn btn-icon btn-sm btn-trigger border-0 position-absolute' style={{ top: '0', right: '0', backgroundColor: '#6576ff', color: '#fff', padding: '2px 1px' }} onClick={() => handleRemoveFile(f.file.name)} >
                                        <svg className="svg-icon" style={{ width: '1em', height: '1em', verticalAlign: 'middle', fill: 'currentColor', overflow: 'hidden', }} viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M810.65984 170.65984q18.3296 0 30.49472 12.16512t12.16512 30.49472q0 18.00192-12.32896 30.33088l-268.67712 268.32896 268.67712 268.32896q12.32896 12.32896 12.32896 30.33088 0 18.3296-12.16512 30.49472t-30.49472 12.16512q-18.00192 0-30.33088-12.32896l-268.32896-268.67712-268.32896 268.67712q-12.32896 12.32896-30.33088 12.32896-18.3296 0-30.49472-12.16512t-12.16512-30.49472q0-18.00192 12.32896-30.33088l268.67712-268.32896-268.67712-268.32896q-12.32896-12.32896-12.32896-30.33088 0-18.3296 12.16512-30.49472t30.49472-12.16512q18.00192 0 30.33088 12.32896l268.32896 268.67712 268.32896-268.67712q12.32896-12.32896 30.33088-12.32896z" />
                                        </svg>
                                    </button>
                                </div>
                            ))}

                        </div>
                    )}



                    <div className="nk-chat-editor position-relative">
                        <div className="nk-chat-editor-upload  ml-n1">
                            {/* <button onClick={() => setShowUploadOptions(!showUploadOptions)} className="btn btn-sm btn-icon btn-trigger text-primary toggle-opt" data-bs-target="chat-upload"><em className="icon ni ni-plus-circle-fill"></em></button> */}

                            <button className="btn btn-sm btn-icon btn-trigger text-primary toggle-opt" >
                                <label className="upload-files m-0 d-flex" style={{ cursor: 'pointer' }}>
                                    <em className="icon ni ni-plus-circle-fill"></em>
                                    <input
                                        type="file"
                                        multiple
                                        style={{ display: 'none' }}
                                        onChange={(e) => { handleFileUpload(e.target.files) }}
                                    />
                                </label>

                            </button>

                            {showUploadOptions && <div className="chat-upload-option" data-content="chat-upload">
                                <ul>
                                    <li>
                                        <label className="upload-files" style={{ cursor: 'pointer' }}>
                                            <em className="icon ni ni-img-fill"></em>
                                            <input
                                                type="file"
                                                multiple
                                                style={{ display: 'none' }}
                                                onChange={(e) => { handleFileUpload(e.target.files) }}
                                            />
                                        </label>
                                    </li>
                                    {/* <li><a href="#"><em className="icon ni ni-camera-fill"></em></a></li>
                                    <li><a href="#"><em className="icon ni ni-mic"></em></a></li>
                                    <li><a href="#"><em className="icon ni ni-grid-sq"></em></a></li> */}
                                </ul>
                            </div>}
                        </div>
                        <div className="nk-chat-editor-form">
                            <div className="form-control-wrap">
                                <input
                                    type="text"
                                    className="form-control form-control-simple no-resize py-1"
                                    id="default-textarea"
                                    value={message}
                                    onChange={handleChangeMessage}
                                    onKeyDown={handleKeyDown}
                                    ref={inputRef}
                                    placeholder="Type your message..."
                                />
                            </div>
                        </div>
                        <ul className="nk-chat-editor-tools g-2">
                            {/* <li>
                                <a href="#" className="btn btn-sm btn-icon btn-trigger text-primary"><em className="icon ni ni-happyf-fill"></em></a>
                            </li> */}
                            <li>
                                <button disabled={!message && filesArr.length === 0} className="btn btn-round btn-primary btn-icon" onClick={sendMessage}><em className="icon ni ni-send-alt"></em></button>
                            </li>
                        </ul>
                    </div>
                </div>
            )

            }

            <ForwardModal
                show={showModal}
                handleClose={() => setShowModal(false)}
                onlineUsers={onlineUsers}
                user={loggedInUser}
                getPrivateRoomId={getPrivateRoomId}
                selectedMessages={selectedMessages}
                setSelectedMessages={setSelectedMessages}
            />

            <ConfirmModal
                show={confirmModalVisible}
                handleClose={hideModal}
                onConfirm={deleteMessages}
                title="Confirm Delete"
                message="Are you sure you want to delete this message?"
            />
        </>
    )
}

export default ChatBox
