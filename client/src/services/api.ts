import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Bearer token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('rova_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor to handle 401 gracefully
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if invalid
      if (localStorage.getItem('rova_token')) {
        localStorage.removeItem('rova_token');
        localStorage.removeItem('rova_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
