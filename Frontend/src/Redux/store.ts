import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "./CartSlice/cartSlice";
import authReducer from "./AuthSlice/AuthSlice";
import orderReducer from "./OrderSlice/OrderSlice";
import checkoutReducer from "./CheckoutSlice/CheckoutSlice";

export const store = configureStore({
  reducer: {
    cart: cartReducer,
    auth: authReducer,
    orders: orderReducer,
    checkout: checkoutReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;