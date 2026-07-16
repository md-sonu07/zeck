import api from './axios';

export const getAdmitCardPagesApi = async (params) => {
    const response = await api.get('/admit-card-pages', { params });
    return response.data;
};

export const getAdmitCardPageByIdApi = async (id) => {
    const response = await api.get(`/admit-card-pages/${id}`);
    return response.data;
};

export const getAdmitCardPageBySlugApi = async (slug) => {
    const response = await api.get(`/admit-card-pages/slug/${slug}`);
    return response.data;
};

export const createAdmitCardPageApi = async (formData) => {
    const response = await api.post('/admit-card-pages', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateAdmitCardPageApi = async (id, formData) => {
    const response = await api.put(`/admit-card-pages/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteAdmitCardPageApi = async (id) => {
    const response = await api.delete(`/admit-card-pages/${id}`);
    return response.data;
};
