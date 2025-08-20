import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_BASE_URL = `${import.meta.env.VITE_BACKEND_URL}/api`;

// Fetch all testimonials
export const fetchAllTestimonials = createAsyncThunk(
  'testimonials/fetchAllTestimonials',
  async ({ page = 1, limit = 10 } = {}, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_BASE_URL}/testimonials/paginated?page=${page}&limit=${limit}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to fetch testimonials'
      );
    }
  }
);

// Add feedback to testimonials (just marking as selected)
export const addFeedbackToTestimonials = createAsyncThunk(
  'testimonials/addFeedbackToTestimonials',
  async (feedbackId, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/testimonials/add-feedback/${feedbackId}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to add feedback to testimonials'
      );
    }
  }
);

// No update needed - removed updateTestimonial thunk

// Delete testimonial
export const deleteTestimonial = createAsyncThunk(
  'testimonials/deleteTestimonial',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_BASE_URL}/testimonials/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to delete testimonial'
      );
    }
  }
);

// Bulk create testimonials
export const bulkCreateTestimonials = createAsyncThunk(
  'testimonials/bulkCreateTestimonials',
  async (testimonialsData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/testimonials/bulk`, {
        testimonials: testimonialsData
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Failed to create testimonials'
      );
    }
  }
);

const testimonialSlice = createSlice({
  name: 'testimonials',
  initialState: {
    testimonials: [],
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalTestimonials: 0,
      hasNext: false,
      hasPrev: false
    },
    loading: false,
    error: null,
    successMessage: null
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    setCurrentPage: (state, action) => {
      state.pagination.currentPage = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all testimonials
      .addCase(fetchAllTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = action.payload.data;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Add feedback to testimonials
      .addCase(addFeedbackToTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addFeedbackToTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials.unshift(action.payload.data);
        state.successMessage = 'Feedback added to testimonials!';
      })
      .addCase(addFeedbackToTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Delete testimonial
      .addCase(deleteTestimonial.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTestimonial.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = state.testimonials.filter(t => t._id !== action.payload);
        state.successMessage = 'Testimonial deleted successfully!';
      })
      .addCase(deleteTestimonial.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Bulk create testimonials
      .addCase(bulkCreateTestimonials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(bulkCreateTestimonials.fulfilled, (state, action) => {
        state.loading = false;
        state.testimonials = [...action.payload.data, ...state.testimonials];
        state.successMessage = `${action.payload.data.length} testimonials created successfully!`;
      })
      .addCase(bulkCreateTestimonials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearError, clearSuccessMessage, setCurrentPage } = testimonialSlice.actions;
export default testimonialSlice.reducer;