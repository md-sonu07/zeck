import { createAsyncThunk } from '@reduxjs/toolkit';
import * as api from '../../api/agent.api';

export const fetchAgents = createAsyncThunk('agent/fetchAgents', async (params, { rejectWithValue }) => {
  try { return await api.getAllAgentsApi(params); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch agents'); }
});

export const fetchAgentById = createAsyncThunk('agent/fetchById', async (id, { rejectWithValue }) => {
  try { return await api.getAgentByIdApi(id); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch agent'); }
});

export const createAgent = createAsyncThunk('agent/create', async (data, { rejectWithValue }) => {
  try { return await api.createAgentApi(data); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to create agent'); }
});

export const updateAgent = createAsyncThunk('agent/update', async ({ id, data }, { rejectWithValue }) => {
  try { return await api.updateAgentApi(id, data); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to update agent'); }
});

export const deleteAgent = createAsyncThunk('agent/delete', async (id, { rejectWithValue }) => {
  try { return await api.deleteAgentApi(id); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to delete agent'); }
});

export const fetchAgentStats = createAsyncThunk('agent/fetchStats', async (_, { rejectWithValue }) => {
  try { return await api.getAgentStatsApi(); }
  catch (e) { return rejectWithValue(e.response?.data?.message || 'Failed to fetch stats'); }
});
