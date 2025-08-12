// src/store/slices/cartSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/v1/cart';

// 👉 Fetch user's cart
export const fetchCart = createAsyncThunk('cart/fetchCart', async (_, thunkAPI) => {
  try {
    const res = await axios.get(API_URL, { withCredentials: true });
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch cart');
  }
});

// 👉 Add item to cart
export const addToCart = createAsyncThunk('cart/addToCart', async ({ productId, quantity = 1 }, thunkAPI) => {
  try {
    const res = await axios.post(
      `${API_URL}/add`,
      { productId, quantity },
      { withCredentials: true }
    );
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to add to cart');
  }
});

// 👉 Remove item from cart
export const removeFromCart = createAsyncThunk('cart/removeFromCart', async (productId, thunkAPI) => {
  try {
    const res = await axios.delete(`${API_URL}/remove/${productId}`, {
      withCredentials: true,
    });
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to remove item');
  }
});

// 👉 Update item quantity
export const updateCartItem = createAsyncThunk('cart/updateCartItem', async ({ productId, quantity }, thunkAPI) => {
  try {
    const res = await axios.put(
      `${API_URL}/update`,
      { productId, quantity },
      { withCredentials: true }
    );
    return res.data.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to update item');
  }
});

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: [],
    subtotal: 0,
    totalItems: 0,
    loading: false,
    error: null,
  },
  reducers: {
    clearCartState: (state) => {
      state.items = [];
      state.subtotal = 0;
      state.totalItems = 0;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.totalItems = action.payload.totalItems || action.payload.items.length;
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.totalItems = action.payload.totalItems;
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.totalItems = action.payload.totalItems;
      })

      .addCase(updateCartItem.fulfilled, (state, action) => {
        state.items = action.payload.items;
        state.subtotal = action.payload.subtotal;
        state.totalItems = action.payload.totalItems;
      });
  },
});

export const { clearCartState } = cartSlice.actions;
export default cartSlice.reducer;
