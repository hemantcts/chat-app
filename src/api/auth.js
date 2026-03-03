import axios from 'axios';

const API = axios.create({
  baseURL: 'https://talk.socceryou.ch/api', // adjust for your backend
});

export const login = (formData) => API.post('/auth/login', formData);
