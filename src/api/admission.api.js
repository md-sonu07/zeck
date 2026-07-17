import api from './axios.js';

export const submitApplicationApi = (formData) =>
    api.post('/admissions/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

export const getAllAdmissionsApi = (params = {}) => {
    const query = new URLSearchParams();
    if (params.status) query.set('status', params.status);
    if (params.course) query.set('course', params.course);
    if (params.search) query.set('search', params.search);
    if (params.startDate) query.set('startDate', params.startDate);
    if (params.endDate) query.set('endDate', params.endDate);
    const qs = query.toString();
    return api.get(`/admissions/all${qs ? `?${qs}` : ''}`);
};

export const getAdmissionByIdApi = (id) => api.get(`/admissions/${id}`);

export const getMyAdmissionsApi = () => api.get('/admissions/me');

export const updateAdmissionStatusApi = (id, data) =>
    api.put(`/admissions/${id}/status`, data);

export const deleteAdmissionApi = (id) => api.delete(`/admissions/${id}`);

export const restoreAdmissionApi = (id) =>
    api.put(`/admissions/${id}/restore`);

export const permanentDeleteAdmissionApi = (id) =>
    api.delete(`/admissions/${id}/permanent`);

export const bulkUpdateAdmissionStatusApi = (data) =>
    api.put('/admissions/bulk-status', data);
