import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios"; // adjust path if needed

const API_URL = "/order";

// Fetch all orders (Admin)
export const fetchAllOrders = createAsyncThunk(
  "order/fetchAllOrders",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/`, { withCredentials: true });
      // console.log("Fetched all orders:", res.data.data);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch orders");
    }
  }
);

// Fetch my orders (User)
export const fetchMyOrders = createAsyncThunk(
  "order/fetchMyOrders",
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/my-orders`, { withCredentials: true });
      console.log("Fetched my orders:", res.data.data);
      if (!res.data.data) {
        return thunkAPI.rejectWithValue("No orders found");
      }
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch your orders");
    }
  }
);

// Get order by ID
export const fetchOrderById = createAsyncThunk(
  "order/fetchOrderById",
  async (orderId, thunkAPI) => {
    if (!orderId) return thunkAPI.rejectWithValue("Order ID is required");
    try {
      const res = await axios.get(`${API_URL}/${orderId}`, { withCredentials: true });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || "Failed to fetch order details");
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    allOrders: [],
    myOrders: [],
    selectedOrder: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearOrderMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch All Orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.allOrders = action.payload;
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch My Orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.myOrders = action.payload;
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Get Order By ID
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.selectedOrder = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearOrderMessages } = orderSlice.actions;

export default orderSlice.reducer;
