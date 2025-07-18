import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Register = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');
  const [user, setUser] = useState({
    name: '',
    email: '',
    password: '',
    department: ''
  });

  useEffect(() => {
    if (localStorage.getItem("token")) {
      navigate("/dashboard/chat");
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://chat.quanteqsolutions.com/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(user)
      });

      const data = await response.json();

      if (data.status) {
        toast.success(data.message || 'Registered successfully! Please login.');
        navigate('/');
      } else {
        toast.error(data.message || 'Registration failed!');
      }

    } catch (err) {
      setError(err.message || 'Registration failed');
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-4">Register for Chat</h3>
        <form onSubmit={handleRegister}>
          <div className="mb-3">
            <label>Name</label>
            <input
              type="text"
              className="form-control"
              name="name"
              value={user.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Email</label>
            <input
              type="email"
              className="form-control"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              name="password"
              value={user.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-3">
            <label>Department</label>
            <select
              className="form-control"
              name="department"
              value={user.department}
              onChange={handleChange}
              required
            >
              <option value="">Select Department</option>
              <option value="sales">Sales</option>
              <option value="marketing">Marketing</option>
              <option value="management">Management</option>
            </select>
          </div>
          <button type="submit" className="btn btn-primary w-100 justify-content-center">Register</button>
        </form>
        <div className="text-center mt-3">
          Already have an account? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
