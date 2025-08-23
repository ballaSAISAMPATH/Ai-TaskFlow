import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch recent logins
export const fetchRecentLogins = createAsyncThunk(
  'loginHistory/fetchRecentLogins',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/loginHistory/recent-logins`, {
        withCredentials: true, // Include cookies if using authentication
      });

      return response.data.data; // Return the actual login data array
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 
        error.message || 
        'Failed to fetch recent logins'
      );
    }
  }
);

const loginHistorySlice = createSlice({
  name: 'loginHistory',
  initialState: {
    recentLogins: [],
    loading: false,
    error: null,
    lastFetch: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetLoginHistory: (state) => {
      state.recentLogins = [];
      state.loading = false;
      state.error = null;
      state.lastFetch = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRecentLogins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchRecentLogins.fulfilled, (state, action) => {
        state.loading = false;
        state.recentLogins = action.payload;
        state.error = null;
        state.lastFetch = new Date().toISOString();
      })
      .addCase(fetchRecentLogins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, resetLoginHistory } = loginHistorySlice.actions;

export default loginHistorySlice.reducer;