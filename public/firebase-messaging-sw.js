// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js');

firebase.initializeApp({
    apiKey: "AIzaSyCnhWoNf9FDQGXGtAIE5AtqqAUj9bhrDGI",
    authDomain: "my-chat-c34af.firebaseapp.com",
    projectId: "my-chat-c34af",
    // storageBucket: "my-chat-c34af.firebasestorage.app",
    messagingSenderId: "64604640770",
    appId: "1:64604640770:web:dd23f1df89dcc0639a791b"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('📦 Received background message: ', payload);
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: '/logo192.png',
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
