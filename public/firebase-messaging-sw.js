// firebase-messaging-sw.js
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
  const notificationTitle = payload.data.title;
  const notificationOptions = {
    body: payload.data.body,
    icon: '/AppIcon.png',
    data: {
      url: payload.data.click_action, // 👈 normalize here
      ...payload.data
    }
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});



self.addEventListener('notificationclick', function(event) {
  event.notification.close();

  const targetUrl = event.notification.data.url || "/"; // 👈 read click_action

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then(clientList => {
      for (const client of clientList) {
        if (client.url === targetUrl && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) {
        return clients.openWindow(targetUrl);
      }
    })
  );
});