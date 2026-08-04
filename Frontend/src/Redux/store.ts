import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./CartSlice/cartSlice";
import authReducer from "./AuthSlice/AuthSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;