import api from './axios';

export const getPageSectionsApi = async () => {
    const response = await api.get('/page-sections');
    return response.data;
};

export const createPageSectionApi = async (sectionData) => {
    const response = await api.post('/page-sections', sectionData);
    return response.data;
};

export const deletePageSectionApi = async (id) => {
    const response = await api.delete(`/page-sections/${id}`);
    return response.data;
};
