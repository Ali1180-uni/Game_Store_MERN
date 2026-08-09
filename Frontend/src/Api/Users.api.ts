import {api} from "./api";

type regUser = {
  name: string;
  email: string;
  password: string;
};

type loginUser = {
  email: string;
  password: string;
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