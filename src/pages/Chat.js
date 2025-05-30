// Chat.js (Frontend - React)
import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';

const socket = io('https://chat.quanteqsolutions.com/'); // change if backend URL is different

const Chat = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [username, setUsername] = useState('Admin'); // You can make it dynamic later

  useEffect(() => {
    socket.on('chatMessage', (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    socket.on('previousMessages', (prevMessages) => {
      setMessages(prevMessages);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      const msgObj = { user: username, text: message };
      socket.emit('chatMessage', msgObj);
      setMessage('');
    }
  };

  return (
    <div className="chat-container p-3">
      <h4>Group Chat</h4>
      <div className="chat-box border p-3 mb-3" style={{ height: '300px', overflowY: 'scroll' }}>
        {messages.map((msg, i) => (
          <div key={i}><strong>{msg.user}:</strong> {msg.text}</div>
        ))}
      </div>
      <div className="d-flex">
        <input
          type="text"
          className="form-control me-2"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
        />
        <button className="btn btn-primary" onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
};

export default Chat;
