import axios from "axios";

type regUser = {
  name: string;
  email: string;
  password: string;
};

type loginUser = {
  email: string;
  password: string;
};

type ReviewPayload = {
  productId: string;
  rating: number;
  comment: string;
};

export type Address = {
  _id: string;
  fullname: string;
  phone: string;
  province: string;
  city: string;
  street: string;
};

export type Notification = {
  _id: string;
  title: string;
  purpose: "Order" | "Payment" | "Ban" | "Account" | "Admin";
  message: string;
  isRead: boolean;
  createdAt: string;
};

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: string;
  accountStatus: string;
};

export type AdminStats = {
  userCount: number;
  productCount: number;
  orderCount: number;
  reviewCount: number;
};

export const api = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true,
  timeout: 5000,
});

export const fetchProducts = async (category?: string) => {
  try {
    const response = await api.get("/products", {
      params: { category },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    throw error;
  }
};

export const fetchProductById = async (id: string) => {
  try {
    const response = await api.get(`/products/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const registerUser = async (data: regUser) => {
  try {
    const response = await api.post("/auth/register", data);
    return response.data;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

export const loginUser = async (data: loginUser) => {
  try {
    const response = await api.post("/auth/login", data);
    return response.data;
  } catch (error) {
    console.error("Error logging in user:", error);
    throw error;
  }
};

export const fetchReviews = async (productId: string) => {
  try {
    const response = await api.get(`/reviews/${productId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching reviews:", error);
    throw error;
  }
};

export const submitReview = async (data: ReviewPayload) => {
  try {
    const token = localStorage.getItem("token");
    const response = await api.post("/reviews", data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting review:", error);
    throw error;
  }
};



export type CreateOrderPayload = {
  items: { product: string; quantity: number }[];
  shippingAddress: string;
  paymentMethod: "jazzCash" | "card" | "cashOnDelivery";
};

export const fetchAddresses = async (): Promise<Address[]> => {
  const token = localStorage.getItem("token");
  const response = await api.get("/addresses", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const addAddress = async (data: Omit<Address, "_id">): Promise<Address> => {
  const token = localStorage.getItem("token");
  const response = await api.post("/addresses", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};


export const createOrderApi = async (data: CreateOrderPayload) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/orders", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchOrder = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/orders/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchNotifications = async (): Promise<Notification[]> => {
  const token = localStorage.getItem("token");
  const response = await api.get("/notifications", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const markNotificationRead = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await api.patch(
    `/notifications/${id}/read`,
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};


export const fetchAllUsers = async (): Promise<AdminUser[]> => {
  const token = localStorage.getItem("token");
  const response = await api.get("/admin/users", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const sendAdminNotification = async (data: {
  userId: string;
  title: string;
  message: string;
}) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/admin/notifications", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchAdminStats = async (): Promise<AdminStats> => {
  const token = localStorage.getItem("token");
  const response = await api.get("/admin/stats", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};