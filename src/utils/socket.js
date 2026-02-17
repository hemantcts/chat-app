import { io } from 'socket.io-client';

// const socket = io('https://chat.quanteqsolutions.com'); // match backend port

const socket = io('https://chat.quanteqsolutions.com', {
  auth: {
    projectId: 'soccer'
  }
});
export default socket;
