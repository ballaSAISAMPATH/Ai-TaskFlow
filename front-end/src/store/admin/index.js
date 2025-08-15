import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

// Async thunks for API calls
export const fetchDashboardStats = createAsyncThunk(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/dashboard/stats`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dashboard stats'
      );
    }
  }
);

export const fetchAllFeedback = createAsyncThunk(
  'admin/fetchAllFeedback',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/feedback?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch feedback'
      );
    }
  }
);

export const replyToFeedback = createAsyncThunk(
  'admin/replyToFeedback',
  async ({ feedbackId, reply }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_BASE_URL}/admin/feedback/${feedbackId}/reply`, { reply });
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to reply to feedback'
      );
    }
  }
);

export const fetchUserStatistics = createAsyncThunk(
  'admin/fetchUserStatistics',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/users/statistics?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user statistics'
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  'admin/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/admin/users/${userId}`);
      return userId;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete user'
      );
    }
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState: {
    // Dashboard state
    dashboardStats: null,
    dashboardLoading: false,
    dashboardError: null,
    
    // Feedback state
    feedback: [],
    feedbackPagination: null,
    feedbackLoading: false,
    feedbackError: null,
    
    // Users state
    users: [],
    usersPagination: null,
    usersLoading: false,
    usersError: null,
    
    // UI state
    activeReplyId: null,
  },
  reducers: {
    clearErrors: (state) => {
      state.dashboardError = null;
      state.feedbackError = null;
      state.usersError = null;
    },
    setActiveReplyId: (state, action) => {
      state.activeReplyId = action.payload;
    },
    updateFeedbackReply: (state, action) => {
      const { feedbackId, reply } = action.payload;
      const feedback = state.feedback.find(f => f._id === feedbackId);
      if (feedback) {
        feedback.reply = reply;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Dashboard stats
      .addCase(fetchDashboardStats.pending, (state) => {
        state.dashboardLoading = true;
        state.dashboardError = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardStats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.dashboardLoading = false;
        state.dashboardError = action.payload;
      })
      
      // Feedback
      .addCase(fetchAllFeedback.pending, (state) => {
        state.feedbackLoading = true;
        state.feedbackError = null;
      })
      .addCase(fetchAllFeedback.fulfilled, (state, action) => {
        state.feedbackLoading = false;
        state.feedback = action.payload.feedback;
        state.feedbackPagination = action.payload.pagination;
      })
      .addCase(fetchAllFeedback.rejected, (state, action) => {
        state.feedbackLoading = false;
        state.feedbackError = action.payload;
      })
      
      // Reply to feedback
      .addCase(replyToFeedback.fulfilled, (state, action) => {
        const updatedFeedback = action.payload;
        const index = state.feedback.findIndex(f => f._id === updatedFeedback._id);
        if (index !== -1) {
          state.feedback[index] = updatedFeedback;
        }
        state.activeReplyId = null;
      })
      
      // User statistics
      .addCase(fetchUserStatistics.pending, (state) => {
        state.usersLoading = true;
        state.usersError = null;
      })
      .addCase(fetchUserStatistics.fulfilled, (state, action) => {
        state.usersLoading = false;
        state.users = action.payload.users;
        state.usersPagination = action.payload.pagination;
      })
      .addCase(fetchUserStatistics.rejected, (state, action) => {
        state.usersLoading = false;
        state.usersError = action.payload;
      })
      
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        const deletedUserId = action.payload;
        state.users = state.users.filter(user => user._id !== deletedUserId);
      });
  }
});

export const { clearErrors, setActiveReplyId, updateFeedbackReply } = adminSlice.actions;
export default adminSlice.reducer;