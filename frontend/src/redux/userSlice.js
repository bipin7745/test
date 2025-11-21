import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import backend_url from "../api_url";
import { toast } from "react-toastify";
import api from "../api";
// Register
export const registerUser = createAsyncThunk(
  "user/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${backend_url}/register`, userData);
      const { user } = res.data;
      toast.success("Registered successfully!");
      localStorage.setItem("user", JSON.stringify(user));
      return user;
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Login
export const loginUser = createAsyncThunk(
  "user/login",
  async ({ username, password }, { rejectWithValue }) => {
    try {
      const res = await api.post(`${backend_url}/login`, {
        username,
        password,
      });
      
      const user = res.data.user;

      if(!user?.token)
      {
        throw new Error("Login Failed token is not response");
      }
      
      toast.success("Login successful!");
      localStorage.setItem("user", JSON.stringify(user));

      return user; 
    } catch (err) {
      toast.error(err.response?.data?.error || "Invalid username or password");
      return rejectWithValue(err.response?.data);
    }
  }
);

// Logout
export const logoutUser = createAsyncThunk("user/logout", async () => {
  localStorage.removeItem("user");
  localStorage.removeItem("token");
  toast.info("Logged out successfully");
});

// Fetch Profile
export const fetchUserProfile = createAsyncThunk(
  "user/fetchProfile",
  async (id, { rejectWithValue }) => {
    try {
      const user =JSON.parse(localStorage.getItem("user"));
      const res = await api.get(`${backend_url}/users/${id}`,{
         headers:{Authorization : `Bearer ${user.token}`}
        }
        );

      return res.data;
    } catch (err) {
      return rejectWithValue(err.response?.data);
    }
  }
);

// Load user from localStorage
export const loadUserFromStorage = createAsyncThunk(
  "user/loadLocal",
  async () => {
    const user = JSON.parse(localStorage.getItem("user"));
    const token = localStorage.getItem("token");
    return user ? { user, token } : null;
  }
);

const userSlice = createSlice({
  name: "user",
  initialState: {
    userInfo: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
     
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.userInfo = action.payload;
     
      })

      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
     
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.userInfo = null;
        state.profile = null;
        state.token = null;
      })
      .addCase(loadUserFromStorage.fulfilled, (state, action) => {
        state.userInfo = action.payload?.user || null;
        state.token = action.payload?.token || null;
      });
  },
});

export default userSlice.reducer;
