import API from './axios';

export const createAgentApi = async (data) => {
  const response = await API.post('/agents', data);
  return response.data;
};

export const getAllAgentsApi = async (params = {}) => {
  const response = await API.get('/agents', { params });
  return response.data;
};

export const getAgentByIdApi = async (id) => {
  const response = await API.get(`/agents/${id}`);
  return response.data;
};

export const updateAgentApi = async (id, data) => {
  const response = await API.put(`/agents/${id}`, data);
  return response.data;
};

export const deleteAgentApi = async (id) => {
  const response = await API.delete(`/agents/${id}`);
  return response.data;
};

export const getAgentStatsApi = async () => {
  const response = await API.get('/agents/stats');
  return response.data;
};
