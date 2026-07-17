import api from './axios.js';

export const getCourseCategoriesApi = (includeDeleted) =>
    api.get(`/course-categories${includeDeleted ? '?includeDeleted=true' : ''}`);

export const getActiveCourseCategoriesApi = () =>
    api.get('/course-categories/active');

export const createCourseCategoryApi = (formData) =>
    api.post('/course-categories', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

export const updateCourseCategoryApi = (id, formData) =>
    api.put(`/course-categories/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

export const deleteCourseCategoryApi = (id) =>
    api.delete(`/course-categories/${id}`);

export const restoreCourseCategoryApi = (id) =>
    api.put(`/course-categories/${id}/restore`);

export const permanentDeleteCourseCategoryApi = (id) =>
    api.delete(`/course-categories/${id}/permanent`);

export const reorderCourseCategoriesApi = (orders) =>
    api.put('/course-categories/reorder', { orders });
