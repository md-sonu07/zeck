import axios from 'axios';

export const apiBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:5000').replace(/\/$/, '');

const api = axios.create({
    baseURL: `${apiBaseUrl}/api`,
    withCredentials: true,
});

// Response interceptor for handling 401 Unauthorized errors
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        const isLoginRequest = originalRequest.url && originalRequest.url.includes('/auth/login');
        const isRefreshRequest = originalRequest.url && originalRequest.url.includes('/auth/refresh');

        if (error.response && error.response.status === 401 && !isLoginRequest && !isRefreshRequest && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                await axios.post(`${apiBaseUrl}/api/auth/refresh`, {}, { withCredentials: true });
                return api(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('userInfo');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }
        
        if (error.response && error.response.status === 401 && !isLoginRequest && !isRefreshRequest) {
            localStorage.removeItem('userInfo');
            window.location.href = '/login';
        }

        return Promise.reject(error);
    }
);

export default api;


