import React from 'react';
import { Nav } from 'react-bootstrap';

const Sidebar = ({ activeTab, setActiveTab }) => {
  return (
    <div className="bg-dark text-white p-3 vh-100" style={{ width: '220px' }}>
      <h4 className="text-center mb-4">Admin Panel</h4>
      <Nav className="flex-column">
        <Nav.Link className={activeTab === 'users' ? 'active text-white' : 'text-white'} onClick={() => setActiveTab('users')}>Manage Users</Nav.Link>
        <Nav.Link className={activeTab === 'chat' ? 'active text-white' : 'text-white'} onClick={() => setActiveTab('chat')}>Chat</Nav.Link>
        <Nav.Link className={activeTab === 'settings' ? 'active text-white' : 'text-white'} onClick={() => setActiveTab('settings')}>Settings</Nav.Link>
      </Nav>
    </div>
  );
};

export default Sidebar;
