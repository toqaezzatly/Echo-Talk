// frontend/src/lib/axios.js
import axios from 'axios';
import { useAuthStore } from "../store/useAuthStore";

const axiosInstance = axios.create({
  baseURL: 'http://localhost:4000/api',
  withCredentials: true, // Essential for cookies
});

// Clean request interceptor for HTTP-only cookies
axiosInstance.interceptors.request.use(config => {
  // Special case for email verification (if needed)
  if (config.url === '/auth/verify-email') {
    delete config.headers.Authorization;
  }
  return config;
});

// Enhanced response interceptor
axiosInstance.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Only handle 401 errors for authenticated routes
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Attempt silent token refresh
        const newToken = await useAuthStore.getState().getNewAccessToken();
        
        if (newToken) {
          // Retry original request with new token
          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Full logout flow on refresh failure
        useAuthStore.getState().logout();
        
        // Smart redirect - only if not already on auth page
        if (!window.location.pathname.startsWith('/login')) {
          window.location.href = '/login';
        }
      }
    }
    
    // Pass through non-auth errors
    return Promise.reject(error);
  }
);

export default axiosInstance;