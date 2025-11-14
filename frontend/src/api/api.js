// src/api/api.js
import axios from 'axios';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // your backend API base URL
  timeout: 10000, // optional timeout
});

// Request interceptor to add Authorization header automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token'); // get token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor (optional) to handle errors globally
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // optionally, handle unauthorized errors (logout user)
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
