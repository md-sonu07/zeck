import API from './axios';

// Get Payment Settings
export const getPaymentSettingsApi = async () => {
    const response = await API.get('/payment/settings');
    return response.data;
};

// Update Payment Settings (Admin)
export const updatePaymentSettingsApi = async (formData) => {
    const response = await API.put('/payment/settings', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
};
