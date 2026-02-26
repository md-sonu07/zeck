import api from "./axios";

export const loginApi = async (data) => {
    const response = await api.post('/auth/login', data);
    return response.data;
};

export const registerApi = async (data) => {
    const response = await api.post('/auth/register', data);
    return response.data;
};

export const logoutApi = async () => {
    const response = await api.post('/auth/logout');
    return response.data;
};