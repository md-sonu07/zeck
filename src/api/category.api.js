import api from './axios';

export const getCategoriesApi = async () => {
    const response = await api.get('/categories');
    return response.data;
};

export const updateCategoryApi = async (categoryData) => {
    const response = await api.put('/categories', categoryData);
    return response.data;
};

export const addCategoryValueApi = async (valueData) => {
    const response = await api.post('/categories/add', valueData);
    return response.data;
};
