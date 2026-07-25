import API from './axios';

export const createCandidateApi = async (data) => {
  const response = await API.post('/candidate-payments', data);
  return response.data;
};

export const getAllCandidatesApi = async (params = {}) => {
  const response = await API.get('/candidate-payments', { params });
  return response.data;
};

export const getCandidateByIdApi = async (id) => {
  const response = await API.get(`/candidate-payments/${id}`);
  return response.data;
};

export const updateCandidateApi = async (id, data) => {
  const response = await API.put(`/candidate-payments/${id}`, data);
  return response.data;
};

export const deleteCandidateApi = async (id) => {
  const response = await API.delete(`/candidate-payments/${id}`);
  return response.data;
};

export const addPaymentApi = async (id, data) => {
  const response = await API.post(`/candidate-payments/${id}/payments`, data);
  return response.data;
};

export const updatePaymentApi = async (id, data) => {
  const response = await API.put(`/candidate-payments/${id}/payments`, data);
  return response.data;
};

export const deletePaymentApi = async (id, paymentId) => {
  const response = await API.delete(`/candidate-payments/${id}/payments/${paymentId}`);
  return response.data;
};

export const getCandidatePaymentStatsApi = async (params = {}) => {
  const response = await API.get('/candidate-payments/stats', { params });
  return response.data;
};

export const getCourseRevenueReportApi = async (params = {}) => {
  const response = await API.get('/candidate-payments/reports/course-revenue', { params });
  return response.data;
};

export const getMonthlyCollectionReportApi = async (params = {}) => {
  const response = await API.get('/candidate-payments/reports/monthly-collection', { params });
  return response.data;
};

export const exportAllCandidatesApi = async () => {
  const response = await API.get('/candidate-payments/export', { responseType: 'blob' });
  return response.data;
};
