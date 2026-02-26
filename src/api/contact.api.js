import api from './axios';

export const getContactSettingsApi = async () => {
    try {
        const response = await api.get('/contact');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateContactSettingsApi = async (updates) => {
    try {
        const response = await api.put('/contact', updates);
        return response.data;
    } catch (error) {
        throw error;
    }
};
