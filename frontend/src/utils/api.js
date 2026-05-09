import axios from 'axios';

const api = axios.create({
  // Vite proxy handles the base URL so we can just use /api
  baseURL: '/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
