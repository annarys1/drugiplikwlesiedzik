import axios from 'axios';

const api = axios.create({
  baseURL: 'http://eduenroll-backend:8801',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
