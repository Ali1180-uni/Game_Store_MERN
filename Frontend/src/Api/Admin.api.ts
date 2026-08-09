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
  _id: string;
  product: { _id: string; title: string; image: string };
  rating: number;
  comment: string;
  createdAt: string;
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

export const updateAccountStatus = async (id: string, accountStatus: "Ban" | "No Ban") => {
  const token = localStorage.getItem("token");
  const response = await api.patch(
    `/admin/users/${id}/status`,
    { accountStatus },
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return response.data;
};