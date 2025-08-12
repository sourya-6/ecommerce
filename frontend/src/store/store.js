import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
import cartReducer from './slices/cartSlice';
import productReducer from './slices/productSlice';
// import snapXReducer from './slices/snapXSlice';
import orderReducer from './slices/orderSlice';
export const store = configureStore({
  reducer: {
    user: userReducer,
    cart: cartReducer,
    product: productReducer,
    order: orderReducer,
    // snapX: snapXReducer,
  },
});
