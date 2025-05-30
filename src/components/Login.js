import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import socket from '../utils/socket';
// import './Login.css'; // Optional: for custom styles

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const room = 'groupChatRoom';

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('https://chat.quanteqsolutions.com/api/auth/login', {
        email,
        password
      });

      localStorage.setItem('token', res.data.token);

      socket.emit('join room', room);

      navigate('/chat'); // redirect after login
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-4">Login to Chat</h3>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label>Email</label>
            <input 
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input 
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Login</button>
        </form>
        <div className="text-center mt-3">
          Don't have an account? <a href="/register">Register</a>
        </div>
      </div>
    </div>
  );
};

export default Login;
