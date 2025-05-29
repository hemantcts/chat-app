import axios from 'axios';

const API = axios.create({
  baseURL: 'https://chat.quanteqsolutions.com/api', // adjust for your backend
});

export const login = (formData) => API.post('/auth/login', formData);
