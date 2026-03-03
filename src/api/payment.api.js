import API from './axios';

// Get Payment Settings
export const getPaymentSettingsApi = async () => {
    const response = await API.get('/payment/settings');
    return response.data;
};

// Update Payment Settings (Admin)
export const updatePaymentSettingsApi = async (data) => {
    const response = await API.put('/payment/settings', data);
    return response.data;
};
