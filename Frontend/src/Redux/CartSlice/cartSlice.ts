import { createSlice } from "@reduxjs/toolkit";

type CartState = {
  count: number;
};

const initialState: CartState = {
  count: 0,
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state) => {
      state.count += 1; // RTK uses Immer under the hood — this "mutation" is safe, it's not really mutating
    },
    removeItem: (state) => {
      state.count = Math.max(0, state.count - 1);
    },
    clearCart: (state) => {
      state.count = 0;
    },
  },
});

export const { addItem, removeItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;