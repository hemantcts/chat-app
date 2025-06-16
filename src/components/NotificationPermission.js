// src/components/NotificationPermission.js
import { messaging, publicVapidKey } from '../firebase';

export async function requestNotificationPermission() {
  if (!messaging) return null;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      console.log('Notification permission granted.');
      return await getToken();
    } else {
      console.log('Unable to get permission to notify.');
      return null;
    }
  } catch (error) {
    console.error('Error getting notification permission:', error);
    return null;
  }
}

async function getToken() {
  try {
    const currentToken = await messaging.getToken({ vapidKey: publicVapidKey });
    if (currentToken) {
      console.log('FCM token:', currentToken);
      return currentToken;
    } else {
      console.log('No registration token available.');
      return null;
    }
  } catch (error) {
    console.error('Error getting FCM token:', error);
    return null;
  }
}