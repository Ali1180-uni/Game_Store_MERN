import { api } from "./api";

export type Notification = {
  _id: string;
  title: string;
  purpose: "Order" | "Payment" | "Ban" | "Account" | "Admin";
  message: string;
  isRead: boolean;
  createdAt: string;
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