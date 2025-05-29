import React, { useEffect, useState } from 'react';
import socket from '../utils/socket';

const roomId = 'general-room'; // static for now

const Chat = ({ user }) => {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    socket.emit('joinRoom', { roomId, userId: user.id });

    socket.on('receiveMessage', (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off('receiveMessage');
  }, [user]);

  const sendMessage = () => {
    if (msg.trim()) {
      socket.emit('sendMessage', {
        roomId,
        senderId: user.id,
        content: msg
      });
      setMsg('');
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h3>Group Chat</h3>
      <div style={{ height: 300, overflowY: 'auto', border: '1px solid #ccc', padding: 10 }}>
        {messages.map((m, i) => (
          <div key={i}><b>{m.senderId}:</b> {m.content}</div>
        ))}
      </div>
      <input value={msg} onChange={(e) => setMsg(e.target.value)} placeholder="Type a message..." />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
};

export default Chat;
