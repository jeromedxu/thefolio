/* eslint-disable no-undef, dot-location */
// frontend/src/api/axios.js
import axios from 'axios';

const baseURL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Derive the backend root URL for accessing uploaded images and static assets.
export const backendURL = process.env.REACT_APP_BACKEND_URL 
  ? process.env.REACT_APP_BACKEND_URL 
  : baseURL.replace(/\/api$/, '');

const instance = axios.create({
 baseURL,
});

// This interceptor runs before EVERY request.
// It reads the token from localStorage and adds it to the Authorization header.
instance.interceptors.request.use((config) => {
 const token = localStorage.getItem('token');
 if (token) {
  config.headers.Authorization = `Bearer ${token}`;
 }
 return config;
});
export default instance;
