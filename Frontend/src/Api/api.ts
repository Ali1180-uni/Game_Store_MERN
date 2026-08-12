import axios from "axios";
// Perform all the Fecthes apis in this folder like Addrss, make import and export them here
import { fetchProducts, fetchProductById } from "./Products.api";
import { fetchAddresses, addAddress } from "./Address.api";
import { fetchReviews, submitReview } from "./Reviews.api";
import { createOrderApi, fetchOrder } from "./Orders.api";
import { registerUser, loginUser } from "./Users.api";
import { fetchNotifications, markNotificationRead } from "./Notification.api";
import { sendOtp, verifyOtp } from "./otpVerification";
import {
  fetchAllUsers,
  sendAdminNotification,
  fetchAdminStats,
  updateUserRole,
  updateUser,
  deleteUser,
  fetchUserReviews,
  updateAccountStatus,
} from "./Admin.api";

export const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  timeout: 5000,
});

export {
  fetchAddresses,
  addAddress,
  fetchProducts,
  fetchProductById,
  fetchReviews,
  submitReview,
  createOrderApi,
  fetchOrder,
  registerUser,
  loginUser,
  fetchNotifications,
  markNotificationRead,
  fetchAllUsers,
  sendAdminNotification,
  fetchAdminStats,
  updateUserRole,
  updateUser,
  deleteUser,
  fetchUserReviews,
  updateAccountStatus,
  sendOtp,
  verifyOtp,
};
