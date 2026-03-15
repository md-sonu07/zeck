import api from './axios';

export const createPaymentSlipApi = async (slipData) => {
    const response = await api.post('/payment-slips', slipData);
    return response.data;
};

export const getPaymentSlipsApi = async () => {
    const response = await api.get('/payment-slips');
    return response.data;
};

export const getPaymentSlipByIdApi = async (id) => {
    const response = await api.get(`/payment-slips/${id}`);
    return response.data;
};

export const deletePaymentSlipApi = async (id) => {
    const response = await api.delete(`/payment-slips/${id}`);
    return response.data;
};

export const updatePaymentSlipApi = async (id, slipData) => {
    const response = await api.put(`/payment-slips/${id}`, slipData);
    return response.data;
};
