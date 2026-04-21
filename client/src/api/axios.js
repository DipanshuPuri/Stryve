import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
  const userInfo = localStorage.getItem('userInfo');
  if (userInfo) {
    const { token } = JSON.parse(userInfo);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Global 401 handler
API.interceptors.response.use(
  (response) => response,
  (error) => {
    // Only redirect if it's a 401 and NOT from the login endpoint
    if (
      error.response && 
      error.response.status === 401 && 
      !error.config.url.includes('/auth/login')
    ) {
      localStorage.removeItem('userInfo');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default API;
