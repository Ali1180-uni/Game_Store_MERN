import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

const MAX_QTY_PER_ITEM = 5;

type CartState = {
  items: Record<string, number>; // productId -> quantity
};

const initialState: CartState = {
  items: {},
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addItem: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      const current = state.items[id] ?? 0;
      if (current < MAX_QTY_PER_ITEM) {
        state.items[id] = current + 1; // same Immer "mutation is safe" pattern as before
      }
    },
    removeItem: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      if (state.items[id] > 1) {
        state.items[id] -= 1;
      } else {
        delete state.items[id];
      }
    },
    deleteItem: (state, action: PayloadAction<string>) => {
      delete state.items[action.payload];
    },
    clearCart: (state) => {
      state.items = {};
    },
  },
});

export const { addItem, removeItem, deleteItem, clearCart } = cartSlice.actions;
export default cartSlice.reducer;