// src/firebase.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyCnhWoNf9FDQGXGtAIE5AtqqAUj9bhrDGI",
  authDomain: "my-chat-c34af.firebaseapp.com",
  projectId: "my-chat-c34af",
  storageBucket: "my-chat-c34af.firebasestorage.app",
  messagingSenderId: "64604640770",
  appId: "1:64604640770:web:dd23f1df89dcc0639a791b"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);


const setupFcm = async (token, authToken) => {
  if (token) {
    // Send to your backend
    localStorage.setItem('fcmToken', token)
    fetch('https://chat.quanteqsolutions.com/api/user/save-fcm-token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: authToken // or however you store JWT
      },
      body: JSON.stringify({ fcmToken: token }),
    });
  }
};

export const getFcmToken = async (authToken) => {
  try {
    let fcmToken = localStorage.getItem('fcmToken');
    if (!fcmToken) {
      const token = await getToken(messaging, {
        vapidKey: 'BJERpC4Wpa4ZHV5SOEndsiytC4fuCp-B1C4VppGI0nC5mYfIB_twxjfjSu_9Kk_N3MezTqLkrYOPQJCwygmTMrg',
      });

      if (token) {
        console.log('✅ FCM Token:', token);
        setupFcm(token, authToken);
      } else {
        console.warn('⚠️ No registration token available. Request permission to generate one.');
      }
    }
  } catch (error) {
    console.error('🔥 An error occurred while retrieving token:', error);
  }
};


export const removeFcmToken = async (userId) => {
  try {
    let token = localStorage.getItem('fcmToken');

    if (token) {
      // console.log('📲 New FCM Token:', token);
      // await AsyncStorage.setItem('fcmToken', token);

      const authToken = localStorage.getItem('token');
      const res = await fetch('https://chat.quanteqsolutions.com/api/user/remove-fcm-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: authToken,
        },
        body: JSON.stringify({ fcmToken: token, userId }),
      });
      const data = await res.json();
      console.log('token data removed', data);
    }
  } catch (error) {
    console.error('🔥 FCM token error:', error);
  }
};