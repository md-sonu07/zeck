import api from './axios';

export const fetchDashboardStats = async () => {
    const response = await api.get('/dashboard/stats');
    return response.data;
};

export const fetchActivities = async (filters = {}) => {
    const response = await api.get('/dashboard/activities', { params: filters });
    return response.data;
};

