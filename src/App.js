import React, { use, useEffect, useState } from 'react';
import Login from './components/Login';
import { MemoryRouter, Routes, Route, useNavigate } from 'react-router-dom';
import './style/responsive.css'



// Main CSS files
import './assets/css/dashlite.css'; 
// import './assets/css/dashlite.min.css';
// import './assets/css/dashlite.rtl.css';
// import './assets/css/dashlite.rtl.min.css';
// import './assets/css/style-email.css';
import './assets/css/theme.css';

// Editors CSS
// import './assets/css/editors/quill.css';
// import './assets/css/editors/quill.rtl.css';
// import './assets/css/editors/summernote.css';
// import './assets/css/editors/summernote.rtl.css';
// import './assets/css/editors/tinymce.css';
// import './assets/css/editors/tinymce.rtl.css';

// Libs CSS
// import './assets/css/libs/bootstrap-icons.css';
// import './assets/css/libs/fontawesome-icons.css';
// import './assets/css/libs/jstree.css';
// import './assets/css/libs/themify-icons.css';

// Skins CSS
// import './assets/css/skins/theme-blue.css';
// import './assets/css/skins/theme-egyptian.css';
// import './assets/css/skins/theme-green.css';
// import './assets/css/skins/theme-purple.css';
// import './assets/css/skins/theme-red.css';



import Dashboard from './pages/Dashboard';
import socket from './utils/socket';

import { ToastContainer, toast } from 'react-toastify';

import { OnlineUsersContext, ProfileImageChangedContext } from './context-api/OnlineUsersContext';



import { getFcmToken, onMessageListener } from './firebase';
import Register from './components/Register';
import ForgotPassword from './components/ForgotPassword';

// In your main App component or chat component

const App = ({config, shadowRoot}) => {
  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        localStorage.setItem('permissionEnabled', 'true');
      } else {
        console.warn('Notification permission denied');
      }
    });
  }, []);

  const [onlineUsers, setOnlineUsers] = useState({});
  const [profileImageChanged, setProfileImageChanged] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem('chatUserData');
    if (user) {
      console.info('app.js2')
      const userData = JSON.parse(user);
      socket.emit('connectUser', { userId: userData?._id });
    }

    socket.on('updateOnlineUsers', ({ onlineUsers }) => {
      console.log('onlineUsers', onlineUsers);
      setOnlineUsers(onlineUsers);
    });

    return () => {
      socket.off('updateOnlineUsers');
    };
  }, []);

  useEffect(() => {
    let user = localStorage.getItem('chatUserData');
    if (user) {
      let userData = JSON.parse(user)
      socket.emit('connectUser', { userId: userData.id });
    }
  }, [])

  const navigate = useNavigate();

  // useEffect(() => {
  //   navigate('/dashboard');
  // }, []);

  useEffect(() => {
    socket.on("conversation-ready", ({userId}) => {
      console.log('conversation-ready', userId);

      navigate(`/dashboard/chat?user=${userId}`);
    });

    window.ChatWidget.navigate = navigate;
  }, []);

  useEffect(() => {
    socket.on("loginUser", (data) => {
      const { email, password } = data;
      console.log('loginUser', email, password);
      const token = localStorage.getItem('token');
      if (!token) {
        handleLogin(email, password);
      }
      else{
        const user = localStorage.getItem('chatUserData');
        const userData = JSON.parse(user);
        socket.emit('connectUser', { userId: userData._id });
      }
    });
  }, []);

  useEffect(() => {
    let userData = localStorage.getItem('userData');
    if (userData) {
      console.warn('got the user data from localStorage', userData);
      userData = JSON.parse(userData);
      let user = {
        userId: userData.id,
        name: userData.first_name,
        email: userData.email || userData.username,
        photoUrl: userData.profile_image_path,
        role: userData.role
      }
      socket.emit('registerUser', { userData: user });
    }
    else{
      console.warn('No user data found in localStorage');
    }
  }, []);


  const handleLogin = async (email, password) => {

    try {

      const response = await fetch(`https://talk.socceryou.ch/api/auth/login?projectId=soccer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      
      if (data.status) {
        socket.emit('connectUser', { userId: data.user._id });
        localStorage.setItem('token', data.token);
        localStorage.setItem('chatUserData', JSON.stringify(data.user));
        // localStorage.setItem('chatUserData', JSON.stringify(data.user));
        // getFcmToken(data.token);
        navigate('/dashboard/chat'); // redirect after login
      }

    } catch (err) {
      // setError(err.response?.data?.message || 'Login failed');
    }
  };

  return (
    <OnlineUsersContext.Provider value={onlineUsers}>
      <ProfileImageChangedContext.Provider value={{ profileImageChanged, setProfileImageChanged }}>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/dashboard/*" element={<Dashboard shadowRoot={shadowRoot} />} />
        </Routes>
      </ProfileImageChangedContext.Provider>
    </OnlineUsersContext.Provider>
  );
};

export default App;
