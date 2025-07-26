import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from 'axios'

const initialData = {
  user: null,
  isAuthenticated: false,
  isLoading: true,
  error: null // Added error field to initial state
}

export const register = createAsyncThunk(
  '/auth/register',
  async (formData) => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/register`, formData, {
      withCredentials: true
    })
    console.log(response);
    
    return response.data
  }   
)

export const login = createAsyncThunk(
  '/auth/login',
  async (formData) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
      formData,
      {
        withCredentials: true,
      }
    );
    return response.data;
  }
);

export const logoutUser = createAsyncThunk(
  "/auth/logout",
  async (_, { dispatch }) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, 
      {},
      { withCredentials: true }
    );
    return response.data;
  }
);

export const checkAuthUser = createAsyncThunk(
  "/auth/checkauth",
  async () => {
    const response = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/auth/check-auth`,
      {
        withCredentials: true,
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );

    return response.data;
  }
);

export const changePassword = createAsyncThunk(
  '/auth/changePassword',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/setnewpassword`, formData)
      console.log(response.data.payload);
      
      return response.data
    } catch (error) {
      // Handle axios errors properly
      if (error.response) {
        // Server responded with error status (400, 404, 500, etc.)
        const message = error.response.data?.message || 'An error occurred';
        return rejectWithValue(message);
      } else if (error.request) {
        // Network error - request was made but no response
        return rejectWithValue('Network error - please check your connection');
      } else {
        // Something else happened
        return rejectWithValue(error.message || 'An unexpected error occurred');
      }
    }
  }
)

export const sendOtp = createAsyncThunk(
  '/api/hadlesendotp', 
  async (formData) => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forgotpassword`, formData)
    console.log(response.data);
    return response.data
  }
)

export const verifyOtp = createAsyncThunk(
  '/verify/otp', 
  async (formData) => {
    const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/forgotpassword`, formData)
    console.log(response.data);
    return response.data
  }
) 

export const googleLogin = createAsyncThunk(
  'auth/googleLogin',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/google-login`, userData, {
        withCredentials: true
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || { message: 'Google login failed' });
    }
  }
);

export const deleteAccountAction = createAsyncThunk(
  "auth/deleteAccount",
  async (userId, { rejectWithValue }) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/delete-account`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();

      if (!response.ok) {
        return rejectWithValue(data.message || "Failed to delete account");
      }

      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error occurred");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: initialData,
  reducers: {
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Register cases
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isAuthenticated = false;
        state.user = action.payload.user;
        state.isLoading = false;
        state.error = null;
      })

      // Login cases
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.rejected, (state, action) => {
        state.isAuthenticated = false;
        state.user = null;
        state.isLoading = false;
        state.error = action.error.message || 'Login failed';
      })
      .addCase(login.fulfilled, (state, action) => {
        console.log(action);
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
        state.error = null;
      })

      // Check auth cases
      .addCase(checkAuthUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(checkAuthUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.success ? action.payload.user : null;
        state.isAuthenticated = action.payload.success;
      })
      .addCase(checkAuthUser.rejected, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Logout cases
      .addCase(logoutUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(logoutUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Logout failed';
      })

      // Change password cases
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // Password changed successfully, keep user authenticated
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Password change failed';
      })

      // Send OTP cases
      .addCase(sendOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // OTP sent successfully
      })
      .addCase(sendOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to send OTP';
      })

      // Verify OTP cases
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        state.error = null;
        // OTP verified successfully
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'OTP verification failed';
      })

      // Google login cases
      .addCase(googleLogin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.success) {
          state.isAuthenticated = true;
          state.user = action.payload.user;
        }
        state.error = null;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload?.message || 'Google login failed';
      })

      // Delete account cases
      .addCase(deleteAccountAction.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteAccountAction.fulfilled, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.error = null;
      })
      .addCase(deleteAccountAction.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload || 'Failed to delete account';
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;