import React, { useState } from 'react';
import Chat from './pages/Chat';
import Login from './components/Login';
import { Routes, Route } from 'react-router-dom';
import AdminDashboard from './pages/AdminDashboard';
import './style/style.css'

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/admin" element={<AdminDashboard />} />
    </Routes>
  );
};

export default App;
