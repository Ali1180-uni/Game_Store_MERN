import { store } from "../Redux/store";
import { refreshToken, logout } from "../Redux/AuthSlice/AuthSlice";
import { api } from "./api";

api.interceptors.response.use(
  (response) => {
    const newToken = response.headers["x-refreshed-token"];
    if (newToken) {
      store.dispatch(refreshToken(newToken));
    }
    return response;
  },
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(logout());
      window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);
