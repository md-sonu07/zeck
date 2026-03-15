import api from './axios';

export const getSlipSettingsApi = async () => {
    try {
        const response = await api.get('/slip-settings');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateSlipSettingsApi = async (data) => {
    try {
        const response = await api.put('/slip-settings', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};
