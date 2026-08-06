import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type DraftItem = {
  productId: string;
  title: string;
  image: string;
  price: number;
  quantity: number;
};

type CheckoutState = {
  items: DraftItem[];
};

const initialState: CheckoutState = { items: [] };

const checkoutSlice = createSlice({
  name: "checkout",
  initialState,
  reducers: {
    setCheckoutItems: (state, action: PayloadAction<DraftItem[]>) => {
      state.items = action.payload;
    },
    clearCheckout: (state) => {
      state.items = [];
    },
  },
});

export const { setCheckoutItems, clearCheckout } = checkoutSlice.actions;
export default checkoutSlice.reducer;