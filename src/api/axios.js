import axios from 'axios';

export const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const api = axios.create({
    baseURL: `${apiBaseUrl}/api`,
    withCredentials: true,
});

// Request interceptor to include the Bearer token
api.interceptors.request.use(
    (config) => {
        const userInfo = localStorage.getItem('userInfo');
        if (userInfo) {
            try {
                const parsedInfo = JSON.parse(userInfo);
                if (parsedInfo.token) {
                    config.headers.Authorization = `Bearer ${parsedInfo.token}`;
                }
            } catch (e) {
                // Ignore parse errors
            }
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for handling 401 Unauthorized errors
api.interceptors.response.use(
    (response) => response,
    (error) => {
        const isLoginRequest = error.config && error.config.url && error.config.url.includes('/auth/login');

        if (error.response && error.response.status === 401 && !isLoginRequest) {
            // Clear local storage and state if session expires
            localStorage.removeItem('userInfo');
            // Force a reload to clear all state and trigger redirects
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;


