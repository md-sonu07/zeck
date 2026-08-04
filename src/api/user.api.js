import api from "./axios";

export const getUserProfileApi = async () => {
    const response = await api.get('/users/profile');
    return response.data;
};

export const getAllUsersApi = async () => {
    const response = await api.get('/users');
    return response.data;
};

export const deleteUserApi = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};

export const makeUserAdminApi = async (id) => {
    const response = await api.put(`/users/${id}/make-admin`);
    return response.data;
};

export const getUserByIdApi = async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

export const removeUserAdminApi = async (id) => {
    const response = await api.put(`/users/${id}/remove-admin`);
    return response.data;
};

export const updateUserProfileApi = async (data) => {
    const response = await api.put('/users/profile', data);
    return response.data;
};

export const toggleUserGenerateIdCardApi = async (id) => {
    const response = await api.put(`/users/${id}/toggle-idcard`);
    return response.data;
};