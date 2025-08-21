import React, { useEffect, useState } from 'react';
import Login from './components/Login';
import { Routes, Route } from 'react-router-dom';
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

const App = () => {
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
    const user = localStorage.getItem('userData');
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
    let user = localStorage.getItem('userData');
    if (user) {
      let userData = JSON.parse(user)
      socket.emit('connectUser', { userId: userData.id });
    }
  }, [])

  return (
    <OnlineUsersContext.Provider value={onlineUsers}>
      <ProfileImageChangedContext.Provider value={{ profileImageChanged, setProfileImageChanged }}>
        <ToastContainer />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot_password" element={<ForgotPassword />} />
          <Route path="/dashboard/*" element={<Dashboard />} />
        </Routes>
      </ProfileImageChangedContext.Provider>
    </OnlineUsersContext.Provider>
  );
};

export default App;
