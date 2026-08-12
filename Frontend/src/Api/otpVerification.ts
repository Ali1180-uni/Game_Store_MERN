import {api} from "./api";

export const sendOtp = async (email: string): Promise<{ otpToken: string }> => {
  const response = await api.post(`/otp/send`, { email });
  return response.data;
};

export const verifyOtp = async (data: { email: string; otp: string; otpToken: string }): Promise<{ message: string }> => {
  const response = await api.post(`/otp/verify`, data);
  return response.data;
};