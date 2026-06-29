import axios from 'axios';

const api = axios.create({
  //baseURL: 'http://eduenroll-backend:8801',
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // Tutaj używamy dokładnie tej samej nazwy, co w Twoim AuthContext!
    const token = localStorage.getItem('token'); 
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
