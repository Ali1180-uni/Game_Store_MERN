import { api } from "./api";

type ReviewPayload = {
  productId: string;
  rating: number;
  comment: string;
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