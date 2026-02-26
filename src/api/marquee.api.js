import api from './axios';

export const getMarqueesApi = async () => {
    const response = await api.get('/marquee');
    return response.data;
};

export const getActiveMarqueesApi = async () => {
    const response = await api.get('/marquee/active');
    return response.data;
};

export const createMarqueeApi = async (data) => {
    const response = await api.post('/marquee', data);
    return response.data;
};

export const updateMarqueeApi = async (id, data) => {
    const response = await api.put(`/marquee/${id}`, data);
    return response.data;
};

export const deleteMarqueeApi = async (id) => {
    const response = await api.delete(`/marquee/${id}`);
    return response.data;
};
