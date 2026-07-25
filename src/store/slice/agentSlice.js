import { createSlice } from '@reduxjs/toolkit';
import { fetchAgents, fetchAgentById, createAgent, updateAgent, deleteAgent, fetchAgentStats } from '../thunk/agentThunk';

const agentSlice = createSlice({
  name: 'agent',
  initialState: { agents: [], selectedAgent: null, stats: null, loading: false, error: null },
  reducers: { clearSelectedAgent: (state) => { state.selectedAgent = null; }, clearAgentError: (state) => { state.error = null; } },
  extraReducers: (builder) => {
    const p = (s) => { s.loading = true; s.error = null; };
    const r = (s, a) => { s.loading = false; s.error = a.payload; };
    builder
      .addCase(fetchAgents.pending, p).addCase(fetchAgents.fulfilled, (s, a) => { s.loading = false; s.agents = a.payload.agents; }).addCase(fetchAgents.rejected, r)
      .addCase(fetchAgentById.pending, p).addCase(fetchAgentById.fulfilled, (s, a) => { s.loading = false; s.selectedAgent = a.payload.agent; }).addCase(fetchAgentById.rejected, r)
      .addCase(createAgent.pending, p).addCase(createAgent.fulfilled, (s, a) => { s.loading = false; s.agents.unshift(a.payload.agent); }).addCase(createAgent.rejected, r)
      .addCase(updateAgent.pending, p).addCase(updateAgent.fulfilled, (s, a) => { s.loading = false; const i = s.agents.findIndex(x => x._id === a.payload.agent._id); if (i !== -1) s.agents[i] = a.payload.agent; }).addCase(updateAgent.rejected, r)
      .addCase(deleteAgent.pending, p).addCase(deleteAgent.fulfilled, (s, a) => { s.loading = false; s.agents = s.agents.filter(x => x._id !== a.meta.arg); }).addCase(deleteAgent.rejected, r)
      .addCase(fetchAgentStats.pending, p).addCase(fetchAgentStats.fulfilled, (s, a) => { s.loading = false; s.stats = a.payload.stats; }).addCase(fetchAgentStats.rejected, r);
  }
});

export const { clearSelectedAgent, clearAgentError } = agentSlice.actions;
export default agentSlice.reducer;
