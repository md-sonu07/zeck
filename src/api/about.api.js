import api from './axios';

export const getAboutSettingsApi = async () => {
    const response = await api.get('/about');
    return response.data;
};

export const updateAboutSettingsApi = async (updates) => {
    const response = await api.put('/about', updates);
    return response.data;
};
