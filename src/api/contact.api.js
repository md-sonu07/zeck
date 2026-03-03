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

export const submitContactMessageApi = async (data) => {
    try {
        const response = await api.post('/contact/messages', data);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const getAllContactMessagesApi = async () => {
    try {
        const response = await api.get('/contact/messages');
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const updateContactMessageStatusApi = async (id, status) => {
    try {
        const response = await api.put(`/contact/messages/${id}`, { status });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const deleteContactMessageApi = async (id) => {
    try {
        const response = await api.delete(`/contact/messages/${id}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
