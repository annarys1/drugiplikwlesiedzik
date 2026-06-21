import axios from 'axios';

const api = axios.create({
  baseURL: 'http://149.156.194.192:8801', 
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;   
