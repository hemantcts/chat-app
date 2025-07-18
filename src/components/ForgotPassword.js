import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleForgotPassword = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`https://chat.quanteqsolutions.com/api/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email })
      });

      const data = await response.json();

      if (data.status) {
        toast.success('Password reset link sent to your email.');
      } else {
        toast.error(data.message || 'Failed to send reset email');
      }
    } catch (err) {
      toast.error('An error occurred. Please try again later.');
      console.error('Forgot Password Error:', err);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow p-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h3 className="text-center mb-4">Forgot Password</h3>
        <form onSubmit={handleForgotPassword}>
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
          <button type="submit" className="btn btn-primary w-100 justify-content-center">Send Reset Link</button>
        </form>
        <div className="text-center mt-3">
          Remember your password? <Link to="/">Login</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
