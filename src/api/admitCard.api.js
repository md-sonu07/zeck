import api from './axios';

export const getAdmitCardsByPageApi = async (pageId, params) => {
    const response = await api.get(`/admit-cards/page/${pageId}`, { params });
    return response.data;
};

export const getAdmitCardByIdApi = async (id) => {
    const response = await api.get(`/admit-cards/${id}`);
    return response.data;
};

export const searchAdmitCardsApi = async (params) => {
    const response = await api.get('/admit-cards/search', { params });
    return response.data;
};

export const createAdmitCardApi = async (formData) => {
    const response = await api.post('/admit-cards', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateAdmitCardApi = async (id, formData) => {
    const response = await api.put(`/admit-cards/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteAdmitCardApi = async (id) => {
    const response = await api.delete(`/admit-cards/${id}`);
    return response.data;
};

export const bulkCreateAdmitCardsApi = async (data) => {
    const response = await api.post('/admit-cards/bulk', data);
    return response.data;
};
