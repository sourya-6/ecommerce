import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = '/api/v1/product';

// Fetch all products
export const getAllProducts = createAsyncThunk(
  'product/getAllProducts',
  async (_, thunkAPI) => {
    try {
      const res = await axios.get(`${API_URL}/`, { withCredentials: true });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch products');
    }
  }
);

// Create single product
export const createProduct = createAsyncThunk(
  'product/createProduct',
  async (formData, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/create`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Product creation failed');
    }
  }
);

// Bulk product upload
export const bulkUploadProducts = createAsyncThunk(
  'product/bulkUploadProducts',
  async (formData, thunkAPI) => {
    try {
      const res = await axios.post(`${API_URL}/bulk-upload`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Bulk upload failed');
    }
  }
);
// Get product by ID
export const getProductById = createAsyncThunk(
  'product/getProductById',
  async (productId, thunkAPI) => {
    if (!productId) {
      return thunkAPI.rejectWithValue('Product ID is required');
    }
    try {
      const res = await axios.get(`${API_URL}/${productId}`, {
        withCredentials: true,
      });
      console.log(res.data.data, "getProductById response");
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        console.log(err, "error in getProductById"),
        err.response?.data?.message || 'Failed to fetch product'
      );
    }
  }
);


const productSlice = createSlice({
  name: 'product',
  initialState: {
    products: [],
    selectedProduct: null,
    loading: false,
    error: null,
    successMessage: null,
  },
  reducers: {
    clearMessages: (state) => {
      state.error = null;
      state.successMessage = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all products
      .addCase(getAllProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create product
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
        state.successMessage = 'Product created successfully';
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Get product by ID
      .addCase(getProductById.pending, (state) => {
  state.loading = true;
  state.error = null;
  state.selectedProduct = null;
})
.addCase(getProductById.fulfilled, (state, action) => {
  state.loading = false;
  state.selectedProduct = action.payload;
})
.addCase(getProductById.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload;
})


      // Bulk Upload
      .addCase(bulkUploadProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(bulkUploadProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = [...state.products, ...action.payload];
        state.successMessage = 'Products uploaded successfully';
      })
      .addCase(bulkUploadProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages } = productSlice.actions;

export default productSlice.reducer;
