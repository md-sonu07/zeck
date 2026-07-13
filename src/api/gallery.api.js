import api from './axios';

export const getGalleryApi = async () => {
    const response = await api.get('/gallery');
    return response.data;
};

export const getAllGalleryApi = async () => {
    const response = await api.get('/gallery/admin');
    return response.data;
};

export const createGalleryApi = async (formData) => {
    const response = await api.post('/gallery', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const updateGalleryApi = async (id, formData) => {
    const response = await api.put(`/gallery/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};

export const deleteGalleryApi = async (id) => {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
};
