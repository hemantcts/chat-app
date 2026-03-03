import { io } from 'socket.io-client';

// const socket = io('https://talk.socceryou.ch'); // match backend port

const socket = io('https://talk.socceryou.ch', {
  auth: {
    projectId: 'soccer'
  }
});
export default socket;
