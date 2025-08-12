import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/v1/user';

// Async Thunks

export const fetchCurrentUser = createAsyncThunk(
  'user/fetchCurrentUser',
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(`${API_URL}/get-user-details`, {
        withCredentials: true,
      });
      return response.data.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch user'
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async ({ email, password }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/login`,
        { email, password },
        { withCredentials: true }
      );

      thunkAPI.dispatch(fetchCurrentUser());

      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Login failed'
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async (_, thunkAPI) => {
    try {
      await axios.post(`${API_URL}/logout`, {}, { withCredentials: true });
      return true;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Logout failed'
      );
    }
  }
);

export const registerUser = createAsyncThunk(
  "user/registerUser",
  async ({ name, username, email, password }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/register`,
        { name, username, email, password },
        { withCredentials: true }
      );

      // Optionally fetch current user right after registration
      thunkAPI.dispatch(fetchCurrentUser());

      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Registration failed"
      );
    }
  }
);



// 👉 Forgot Password
export const forgotPassword = createAsyncThunk(
  'user/forgotPassword',
  async (email, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/forgot-password`, { email });
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to send reset email'
      );
    }
  }
);
export const sendOTP = createAsyncThunk(
  'user/sendOTP',
  async (email, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/send-otp`, { email });
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to send OTP'
      );
    }
  }
);

// 👉 Reset Password
export const resetPassword = createAsyncThunk(
  'user/resetPassword',
  async ({ newPassword, token }, thunkAPI) => {
    try {
      const response = await axios.post(
        `${API_URL}/reset-password`,
        { newPassword },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.message;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Password reset failed'
      );
    }
  }
);

// Slice
const userSlice = createSlice({
  name: 'user',
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false,
    loadingAuth: true,
    error: null,
    successMessage: null, // to show forgot/reset messages
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Fetch Current User
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loadingAuth = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loadingAuth = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
        state.loadingAuth = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // Logout
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
      })

      // Forgot Password
      .addCase(forgotPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(forgotPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(forgotPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      

      // Reset Password
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.successMessage = action.payload;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = userSlice.actions;

export default userSlice.reducer;
