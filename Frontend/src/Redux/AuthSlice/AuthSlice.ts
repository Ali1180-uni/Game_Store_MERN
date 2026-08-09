import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: "Admin" | "Employee" | "Customer";
};

type AuthState = {
  token: string | null;
  user: AuthUser | null;
};

const storedUser = localStorage.getItem("user");

const initialState: AuthState = {
  token: localStorage.getItem("token"),
  user: storedUser ? JSON.parse(storedUser) : null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ token: string; user: AuthUser }>,
    ) => {
      state.token = action.payload.token;
      state.user = action.payload.user;
      localStorage.setItem("token", action.payload.token);
      localStorage.setItem("user", JSON.stringify(action.payload.user));
    },
    logout: (state) => {
      state.token = null;
      state.user = null;
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    refreshToken: (state, action: PayloadAction<string>) => {
      state.token = action.payload;
      localStorage.setItem("token", action.payload);
    },
  },
});

export const { setCredentials, logout, refreshToken } = authSlice.actions;
export default authSlice.reducer;
