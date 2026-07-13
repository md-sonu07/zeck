import api from './axios';

export const getAboutSettingsApi = async () => {
    const response = await api.get('/about');
    return response.data;
};

export const updateAboutSettingsApi = async (formData) => {
    const response = await api.put('/about', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};
