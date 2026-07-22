import api from './axios';
import axios from 'axios';

// Helper: try primary api instance first, then fall back to localhost:5000 if network error
const tryWithFallback = async (fn) => {
    try {
        return await fn();
    } catch (err) {
        // If primary API failed due to network or CORS, attempt a localhost fallback
        try {
            const fallbackBase = `${window.location.protocol}//${window.location.hostname}:5000/api`;
            // create a direct axios instance for fallback (no auth cookie handling)
            const fallback = axios.create({ baseURL: fallbackBase });
            // Replace api client in fn by temporarily calling the same endpoint on fallback
            // We expect fn to call api.get/post with a path; so detect the requested path from the error config when available
            if (err && err.config && err.config.url) {
                const method = (err.config.method || 'get').toLowerCase();
                const url = err.config.url;
                const data = err.config.data ? JSON.parse(err.config.data) : undefined;
                const res = await fallback.request({ url, method, data });
                return res;
            }
        } catch (fallbackErr) {
            // final failure -> throw original
            throw err;
        }
        throw err;
    }
};

export const getAdmitCardPagesApi = async (params) => {
    const res = await tryWithFallback(() => api.get('/admit-card-pages', { params }));
    return res.data;
};

export const getAdmitCardPageByIdApi = async (id) => {
    const res = await tryWithFallback(() => api.get(`/admit-card-pages/${id}`));
    return res.data;
};

export const getAdmitCardPageBySlugApi = async (slug) => {
    const res = await tryWithFallback(() => api.get(`/admit-card-pages/slug/${slug}`));
    return res.data;
};

export const createAdmitCardPageApi = async (formData) => {
    const res = await tryWithFallback(() => api.post('/admit-card-pages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }));
    return res.data;
};

export const updateAdmitCardPageApi = async (id, formData) => {
    const res = await tryWithFallback(() => api.put(`/admit-card-pages/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    }));
    return res.data;
};

export const deleteAdmitCardPageApi = async (id) => {
    const res = await tryWithFallback(() => api.delete(`/admit-card-pages/${id}`));
    return res.data;
};
