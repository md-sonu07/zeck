import api from './axios.js';

export const getCoursesApi = (params = {}) => {
    const query = new URLSearchParams();
    if (params.includeDeleted) query.set('includeDeleted', 'true');
    if (params.isActive !== undefined) query.set('isActive', params.isActive);
    if (params.category) query.set('category', params.category);
    if (params.isArchived !== undefined) query.set('isArchived', params.isArchived);
    if (params.admissionOpen !== undefined) query.set('admissionOpen', params.admissionOpen);
    if (params.featured !== undefined) query.set('featured', params.featured);
    if (params.search) query.set('search', params.search);
    const qs = query.toString();
    return api.get(`/courses${qs ? `?${qs}` : ''}`);
};

export const getCourseByIdApi = (id) => api.get(`/courses/${id}`);

export const getCourseByCodeApi = (code) => api.get(`/courses/code/${code}`);

export const createCourseApi = (formData) =>
    api.post('/courses', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

export const updateCourseApi = (id, formData) =>
    api.put(`/courses/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
    });

export const deleteCourseApi = (id) => api.delete(`/courses/${id}`);

export const restoreCourseApi = (id) => api.put(`/courses/${id}/restore`);

export const permanentDeleteCourseApi = (id) =>
    api.delete(`/courses/${id}/permanent`);

export const duplicateCourseApi = (id) =>
    api.put(`/courses/${id}/duplicate`);

export const bulkImportCoursesApi = (courses) =>
    api.post('/courses/bulk-import', { courses });
