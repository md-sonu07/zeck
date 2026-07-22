import api from './axios';

export const getArticlesApi = async (filters) => {
    const params = new URLSearchParams(filters).toString();
    const response = await api.get(`/articles?${params}`);
    return response.data;
};

export const createArticleApi = async (articleData) => {
    const response = await api.post('/articles', articleData);
    return response.data;
};

export const updateArticleApi = async ({ id, articleData }) => {
    const response = await api.put(`/articles/${id}`, articleData);
    return response.data;
};

export const deleteArticleApi = async (id) => {
    const response = await api.delete(`/articles/${id}`);
    return response.data;
};

export const getArticleByIdApi = async (idOrSlug) => {
    try {
        const response = await api.get(`/articles/${idOrSlug}`);
        return response.data;
    } catch (error) {
        if (error?.response?.status === 404) {
            return null;
        }
        throw error;
    }
};

// Save/Unsave post toggle
export const toggleSavePostApi = async (articleId) => {
    const response = await api.put(`/articles/save/${articleId}`);
    return response.data;
};

// Get user's saved posts
export const getSavedPostsApi = async () => {
    const response = await api.get('/articles/saved');
    return response.data;
};
