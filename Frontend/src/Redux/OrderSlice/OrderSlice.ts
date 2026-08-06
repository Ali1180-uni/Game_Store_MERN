import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type OrderItem = {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
};

export type PaymentMethod = "Card" | "EasyPaisa" | "COD";

export type OrderAddress = {
  street: string;
  city: string;
  postalCode: string;
  country: string;
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  createdAt: string;
  status: "pending" | "confirmed";
  address?: OrderAddress;
  paymentMethod?: PaymentMethod;
};

type OrderState = {
  orders: Record<string, Order>;
};

const stored = localStorage.getItem("orders");

const initialState: OrderState = {
  orders: stored ? JSON.parse(stored) : {},
};

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    createOrder: (state, action: PayloadAction<Order>) => {
      state.orders[action.payload.id] = action.payload;
      localStorage.setItem("orders", JSON.stringify(state.orders));
    },
    confirmOrder: (
      state,
      action: PayloadAction<{
        id: string;
        address: OrderAddress;
        paymentMethod: PaymentMethod;
      }>
    ) => {
      const order = state.orders[action.payload.id];
      if (order) {
        order.status = "confirmed";
        order.address = action.payload.address;
        order.paymentMethod = action.payload.paymentMethod;
        localStorage.setItem("orders", JSON.stringify(state.orders));
      }
    },
  },
});

export const { createOrder, confirmOrder } = orderSlice.actions;
export default orderSlice.reducer;