import API from './axios';

// Submit a new application
export const submitApplicationApi = async (data) => {
    // Expected to receive FormData since we have file uploads
    const response = await API.post('/applications/submit', data, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};

// Get all applications (Admin)
export const getAllApplicationsApi = async () => {
    const response = await API.get('/applications/all');
    return response.data;
};

// Get my applications (User)
export const getMyApplicationsApi = async () => {
    const response = await API.get('/applications/me');
    return response.data;
};


// Update status (Admin)
export const updateApplicationStatusApi = async (id, status) => {
    const response = await API.put(`/applications/${id}/status`, { status });
    return response.data;
};

// Delete application (Admin)
export const deleteApplicationApi = async (id) => {
    const response = await API.delete(`/applications/${id}`);
    return response.data;
};
