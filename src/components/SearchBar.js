import React, { useState, useMemo, useEffect } from "react";
import { Form } from "react-bootstrap";

const SearchBar = ({ showDetails, setShowDetails, messages, userId, groupId, setHighlightedMessageId, page, hasMoreMessages, getChatMessages, userDetails, getGroupMessages, loadOlderMessages }) => {
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


    return (
        <div
            className={`nk-chat-profile ${showDetails ? "visible" : ""}`}
            data-simplebar
        >
            <div className="user-card user-card-s2 my-4">
                <h4 style={{ marginBottom: "1rem" }}>Find in chat</h4>

                <div className="search_box" style={{ width: "100%" }}>
                    <Form.Control
                        type="text"
                        placeholder="Enter a search keyword and press Enter"
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
                    <h4>Results</h4>
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
