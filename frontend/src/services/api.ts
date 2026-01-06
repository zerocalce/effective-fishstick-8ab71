import axios from 'axios';

const API_URL = 'http://localhost:3001/api';

const api = axios.create({
  baseURL: API_URL,
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('studio_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle 401 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token might be expired, or user is not logged in
      // For now, we just clear the token and let the App state handle redirection to login
      localStorage.removeItem('studio_token');
      localStorage.removeItem('studio_user');
      // window.location.href = '/login'; // Optional: force reload to login page
    }
    return Promise.reject(error);
  }
);

export default api;
