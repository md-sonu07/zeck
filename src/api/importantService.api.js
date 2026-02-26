import api from './axios';

export const getImportantServicesApi = async () => {
    const response = await api.get('/important-services');
    return response.data;
};

export const createImportantServiceApi = async (data) => {
    const response = await api.post('/important-services', data);
    return response.data;
};

export const updateImportantServiceApi = async (id, data) => {
    const response = await api.put(`/important-services/${id}`, data);
    return response.data;
};

export const deleteImportantServiceApi = async (id) => {
    const response = await api.delete(`/important-services/${id}`);
    return response.data;
};
