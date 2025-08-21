import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/user-dashboard`;

export const fetchDashboardAnalytics = createAsyncThunk(
  'dashboard/fetchAnalytics',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${API_BASE_URL}/dashboard/analytics/${userId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard analytics');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  analytics: {
    data: [],
    summary: null,
    loading: false,
    error: null
  }
};

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    clearAnalyticsData: (state) => {
      state.analytics = { data: [], summary: null, loading: false, error: null };
    },
    
    clearAnalyticsError: (state) => {
      state.analytics.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardAnalytics.pending, (state) => {
        state.analytics.loading = true;
        state.analytics.error = null;
      })
      .addCase(fetchDashboardAnalytics.fulfilled, (state, action) => {
        state.analytics.loading = false;
        state.analytics.data = action.payload.data.dailyAnalytics;
        state.analytics.summary = action.payload.data.summary;
      })
      .addCase(fetchDashboardAnalytics.rejected, (state, action) => {
        state.analytics.loading = false;
        state.analytics.error = action.payload;
      });
  }
});

export const {
  clearAnalyticsData,
  clearAnalyticsError
} = dashboardSlice.actions;

export const selectDashboardAnalytics = (state) => state.dashboard.analytics;

export default dashboardSlice.reducer;