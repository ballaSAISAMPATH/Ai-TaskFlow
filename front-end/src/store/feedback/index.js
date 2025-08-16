import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api/feedback`;

export const createFeedback = createAsyncThunk(
  'feedback/createFeedback',
  async (feedbackData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/createFeedback`, feedbackData);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getAllFeedback = createAsyncThunk(
  'feedback/getAllFeedback',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getAllFeedback`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const getFeedbackByUser = createAsyncThunk(
  'feedback/getFeedbackByUser',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/getFeedbackByUser/user/${userId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);


const initialState = {
  feedbacks: [],
  userFeedbacks: [],
  loading: false,
  error: null,
  createLoading: false,
  deleteLoading: false,
};

const feedbackSlice = createSlice({
  name: 'feedback',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearFeedbacks: (state) => {
      state.feedbacks = [];
    },
    clearUserFeedbacks: (state) => {
      state.userFeedbacks = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createFeedback.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createFeedback.fulfilled, (state, action) => {
        state.createLoading = false;
        state.feedbacks.unshift(action.payload.data);
      })
      .addCase(createFeedback.rejected, (state, action) => {
        state.createLoading = false;
        state.error = action.payload;
      })

      .addCase(getAllFeedback.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllFeedback.fulfilled, (state, action) => {
        state.loading = false;
        state.feedbacks = action.payload.data;
      })
      .addCase(getAllFeedback.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(getFeedbackByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getFeedbackByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userFeedbacks = action.payload.data;
      })
      .addCase(getFeedbackByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
  },
});

export const { clearError, clearFeedbacks, clearUserFeedbacks } = feedbackSlice.actions;

export const selectAllFeedbacks = (state) => state.feedback.feedbacks;
export const selectUserFeedbacks = (state) => state.feedback.userFeedbacks;
export const selectFeedbackLoading = (state) => state.feedback.loading;
export const selectFeedbackError = (state) => state.feedback.error;
export const selectCreateLoading = (state) => state.feedback.createLoading;
export const selectDeleteLoading = (state) => state.feedback.deleteLoading;

export default feedbackSlice.reducer;