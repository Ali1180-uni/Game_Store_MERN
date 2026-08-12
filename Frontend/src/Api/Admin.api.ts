import { api } from "./api";

export type AdminUserFull = {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "Employee" | "Customer";
  accountStatus: "Ban" | "No Ban";
};

export type AdminUser = {
  _id: string;
  name: string;
  email: string;
  role: "Admin" | "Employee" | "Customer";
  accountStatus: "Ban" | "No Ban";
};

export type AdminStats = {
  userCount: number;
  productCount: number;
  orderCount: number;
  reviewCount: number;
};

export type UserReview = {
  user: { name: string; email: string } | null;
  _id: string;
  product: { _id: string; title: string; image: string };
  rating: number;
  comment: string;
  createdAt: string;
};

export type ProductDetail = {
  gameType: string;
  preOrder: boolean;
  preOrderReleaseDate?: string | null;
  platform: string;
  brand: string;
};

export type AdminProduct = {
  _id: string;
  title: string;
  description: string;
  image: string;
  price: number;
  isAvailable: boolean;
  category: "Game" | "Accessories";
  stock: number;
  details: ProductDetail[];
};

export const fetchAdminProducts = async (): Promise<AdminProduct[]> => {
  const token = localStorage.getItem("token");
  const response = await api.get("/admin/products", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const createProduct = async (data: FormData) => {
  const token = localStorage.getItem("token");
  const response = await api.post("/admin/products", data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateProduct = async (id: string, data: FormData) => {
  const token = localStorage.getItem("token");
  const response = await api.put(`/admin/products/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateProductStock = async (id: string, stock: number) => {
  const token = localStorage.getItem("token");
  const response = await api.patch(
    `/admin/products/${id}/stock`,
    { stock },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};

export const deleteProduct = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await api.delete(`/admin/products/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
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

export const updateUserRole = async (id: string, role: string) => {
  const token = localStorage.getItem("token");
  const response = await api.patch(
    `/admin/users/${id}/role`,
    { role },
    { headers: { Authorization: `Bearer ${token}` } },
  );
  return response.data;
};

export const updateUser = async (
  id: string,
  data: { name: string; email: string },
) => {
  const token = localStorage.getItem("token");
  const response = await api.put(`/admin/users/${id}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteUser = async (id: string) => {
  const token = localStorage.getItem("token");
  const response = await api.delete(`/admin/users/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchUserReviews = async (userId: string): Promise<UserReview[]> => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/admin/users/${userId}/reviews`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const fetchAllReviews = async (): Promise<UserReview[]> => {
  const token = localStorage.getItem("token");
  const response = await api.get(`/admin/reviews`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateReview = async (reviewId: string, data: { rating: number; comment: string }) => {
  const token = localStorage.getItem("token");
  const response = await api.put(`/admin/reviews/${reviewId}`, data, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const deleteReview = async (reviewId: string) => {
  const token = localStorage.getItem("token");
  const response = await api.delete(`/admin/reviews/${reviewId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateAccountStatus = async (id: string, accountStatus: "Ban" | "No Ban") => {
  const token = localStorage.getItem("token");
  const response = await api.patch(
    `/admin/users/${id}/status`,
    { accountStatus },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};