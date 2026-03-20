import React, { useState, useMemo, useEffect } from "react";
import { Form } from "react-bootstrap";
import { t } from "../utils/i18n";

const SearchBar = ({ showDetails, setShowDetails, messages, userId, groupId, setHighlightedMessageId, page, hasMoreMessages, getChatMessages, userDetails, getGroupMessages, loadOlderMessages, setShowSearch }) => {
    const [searchTerm, setSearchTerm] = useState("");
    const [searchQuery, setSearchQuery] = useState(""); // Trigger search only when Enter is pressed



    // Filter messages that include the search query (case-insensitive)
    // const [filteredMessages, setFilteredMessages] = useState([]);

    const filteredMessages = useMemo(() => {
        if (!searchQuery.trim()) return [];
        return messages.filter((msg) =>
            msg.content
                ?.replace(/<[^>]+>/g, "")
                .toLowerCase()
                .includes(searchQuery.toLowerCase())
        );
    }, [messages, searchQuery]);

    // Highlight matched term inside message text
    const highlightText = (text) => {
        const cleanText = text.replace(/<[^>]+>/g, "");
        if (!searchQuery) return cleanText;
        const regex = new RegExp(`(${searchQuery})`, "gi");
        return cleanText.replace(regex, `<mark>$1</mark>`);
    };

    // Handle Enter key press
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            setSearchQuery(searchTerm.trim());
        }
    };

    // const searchAllPages = async (query) => {
    //     let currentPage = page;
    //     let allMessages = [...messages];

    //     while (true) {
    //         // Search inside currently loaded messages
    //         const matched = allMessages.filter((msg) =>
    //             msg.content
    //                 ?.replace(/<[^>]+>/g, "")
    //                 .toLowerCase()
    //                 .includes(query.toLowerCase())
    //         );

    //         if (matched.length > 0) {
    //             return matched; // Found!
    //         }

    //         // No more pages left
    //         if (!hasMoreMessages) {
    //             return []; // not found
    //         }

    //         // Load next page
    //         const nextPage = currentPage + 1;
    //         currentPage = nextPage;
    //         // await loadOlderMessages();

    //         let newMsgs;
    //         if (userId) {
    //             newMsgs = await getChatMessages(userDetails?._id, nextPage);
    //         } else {
    //             newMsgs = await getGroupMessages(groupId, nextPage);
    //         }

    //         // If API returned empty → stop
    //         if (!newMsgs || newMsgs.length === 0) {
    //             return [];
    //         }

    //         // Append to array
    //         allMessages = [...allMessages, ...newMsgs];
    //     }
    // };


    // const handleKeyDown = async (e) => {
    //     if (e.key === "Enter") {
    //         e.preventDefault();

    //         const query = searchTerm.trim();
    //         if (!query) return;

    //         setSearchQuery(query);

    //         // 1. Try search in current messages
    //         let found = filteredMessages;

    //         // 2. If nothing found → search through pagination
    //         if (found.length === 0) {
    //             const results = await searchAllPages(query);
    //             setFilteredMessages(results);
    //         }
    //     }
    // };


    useEffect(() => {
        setSearchQuery("")
        setSearchTerm("")
        setShowDetails(false)
    }, [userId, groupId])

    const closeSearch = () => {
        setSearchQuery("")
        setSearchTerm("")
        setShowDetails(false)
    }


    return (
        <div
            className={`nk-chat-profile ${showDetails ? "visible" : ""}`}
            data-simplebar
        >
            <div className="user-card user-card-s2 my-4">
                <button className='btn btn-icon btn-sm btn-trigger1 position-absolute' style={{ top: '50%', right: '1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transform: 'translateY(-50%)', backgroundColor: '#e5e9f2', borderRadius: '50%' }} onClick={closeSearch}>
                    <svg width="43" height="43" viewBox="0 0 43 43" fill="none" xmlns="http://www.w3.org/2000/svg" style={{height: '30px', width: '30px', position: 'absolute', top: '0.5rem', right: '0.5rem'}}>
                        <path d="M21.7871 3.5C11.7934 3.5 3.84961 11.4437 3.84961 21.4375C3.84961 31.4312 11.7934 39.375 21.7871 39.375C31.7809 39.375 39.7246 31.4312 39.7246 21.4375C39.7246 11.4437 31.7809 3.5 21.7871 3.5ZM21.7871 36.8125C13.3309 36.8125 6.41211 29.8937 6.41211 21.4375C6.41211 12.9812 13.3309 6.0625 21.7871 6.0625C30.2434 6.0625 37.1621 12.9812 37.1621 21.4375C37.1621 29.8937 30.2434 36.8125 21.7871 36.8125Z" fill="var(--chat-name-color)"></path>
                        <path d="M28.8535 30.5977L21.7871 23.5313L14.7207 30.5977L12.627 28.5039L19.6934 21.4375L12.627 14.3711L14.7207 12.2773L21.7871 19.3437L28.8535 12.2773L30.9473 14.3711L23.8809 21.4375L30.9473 28.5039L28.8535 30.5977Z" fill="var(--chat-name-color)"></path>
                    </svg>
                </button>
                <h4 style={{ marginBottom: "1rem" }}>{t("findInChat")}</h4>

                <div className="search_box" style={{ width: "100%" }}>
                    <Form.Control
                        type="text"
                        placeholder={t("enterSearch")}
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="form-round"
                    />
                </div>
            </div>

            {/* Search Results */}
            {searchQuery && (
                <div style={{ padding: "0 1rem" }}>
                    <h4>{t("result")}</h4>
                    {filteredMessages.length > 0 ? (
                        filteredMessages.map((msg, index) => (
                            <div
                                key={msg._id || index}
                                className="search-result-item py-2"
                                style={{
                                    borderBottom: "1px solid #dbdfea",
                                    cursor: "pointer",
                                    display: "flex",
                                    gap: "10px",
                                }}
                                onClick={() => {
                                    const messageElement = document.getElementById(`message-${msg._id}`);
                                    setHighlightedMessageId(msg._id);
                                    if (messageElement) {
                                        messageElement.scrollIntoView({
                                            // behavior: "smooth",
                                            block: "center", // 👈 centers the message in the viewport
                                        });
                                        // setShowDetails(false); // hide search sidebar after click (optional)
                                        setTimeout(() => setHighlightedMessageId(null), 2000);
                                    }
                                }}
                            >
                                <div className="user-avatar sm mt-0">
                                    {msg?.senderDetails?.name?.slice(0, 2).toUpperCase()}
                                </div>
                                <div style={{ width: '100%' }}>
                                    <div
                                        style={{
                                            fontWeight: "600",
                                            fontSize: "14px",
                                            color: "#8094ae",
                                            marginBottom: "4px",
                                            display: 'flex',
                                            justifyContent: 'space-between'
                                        }}
                                    >
                                        {msg.senderDetails?.name || "Unknown User"}{" "}
                                        <span style={{ fontSize: "12px", color: "#aaa" }}>
                                            {msg.createdAt}
                                        </span>
                                    </div>
                                    <div
                                        style={{ fontSize: "14px" }}
                                        dangerouslySetInnerHTML={{
                                            __html: highlightText(msg.content),
                                        }}
                                    />
                                </div>
                            </div>
                        ))
                    ) : (
                        <p style={{ color: "#999", padding: "1rem" }}>
                            No messages found for “{searchTerm}”
                        </p>
                    )}
                </div>
            )}
        </div>
    );
};

export default SearchBar;
