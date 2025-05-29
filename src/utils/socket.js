import { io } from 'socket.io-client';

const socket = io('https://chat.quanteqsolutions.com'); // match backend port
export default socket;
