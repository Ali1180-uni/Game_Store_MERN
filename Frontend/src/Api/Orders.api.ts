import { api } from "./api";

export type CreateOrderPayload = {
  items: { product: string; quantity: number }[];
  shippingAddress: string;
  paymentMethod: "jazzCash" | "card" | "cashOnDelivery";
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