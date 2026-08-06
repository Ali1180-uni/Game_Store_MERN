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


export type Address = {
  _id: string;
  fullname: string;
  phone: string;
  province: string;
  city: string;
  street: string;
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