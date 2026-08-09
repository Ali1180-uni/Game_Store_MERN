import { api } from "./api";

export type Address = {
  _id: string;
  fullname: string;
  phone: string;
  province: string;
  city: string;
  street: string;
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