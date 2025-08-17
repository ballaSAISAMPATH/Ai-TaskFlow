import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/landing-page`;

export const fetchLandingStats = createAsyncThunk(
  'stats/fetchLandingStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/landing`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

const initialState = {
  totalUsers: 0,
  totalGoals: 0,
  completedGoals: 0,
  successRate: 0,
  loading: false,
  error: null
};

const statsSlice = createSlice({
  name: 'stats',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchLandingStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchLandingStats.fulfilled, (state, action) => {
        state.loading = false;
        Object.assign(state, action.payload);
      })
      .addCase(fetchLandingStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export default statsSlice.reducer;