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

export const getFcmToken = async () => {
  try {
    const token = await getToken(messaging, {
      vapidKey: 'BJERpC4Wpa4ZHV5SOEndsiytC4fuCp-B1C4VppGI0nC5mYfIB_twxjfjSu_9Kk_N3MezTqLkrYOPQJCwygmTMrg', // From Firebase > Project Settings > Cloud Messaging
    });

    if (token) {
      console.log('✅ FCM Token:', token);
      return token;
    } else {
      console.warn('⚠️ No registration token available. Request permission to generate one.');
    }
  } catch (error) {
    console.error('🔥 An error occurred while retrieving token:', error);
  }
};
