import { configureStore } from '@reduxjs/toolkit';
import userReducer from './slices/userSlice';
// import cartReducer from './slices/cartSlice';
// import productReducer from './slices/productSlice';
// import snapXReducer from './slices/snapXSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    // cart: cartReducer,
    // product: productReducer,
    // snapX: snapXReducer,
  },
});
