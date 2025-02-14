// lib/axios.ts
import axios from 'axios';

const apiClient = axios.create({
  baseURL: '/api', // Base URL for your API routes
});

// Add a request interceptor to attach the token
apiClient.interceptors.request.use((config) => {
  // Exclude Cloudinary requests from adding the Authorization header
  if (!config.url?.includes('cloudinary.com')) {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default apiClient;