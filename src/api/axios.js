import axios from 'axios';

export const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const api = axios.create({
    baseURL: `${apiBaseUrl}/api`,
    withCredentials: true,
});

// Response interceptor for handling 401 Unauthorized errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Clear local storage and state if session expires
            localStorage.removeItem('userInfo');
            // Force a reload to clear all state and trigger redirects
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;


