import axiosClient from "@/lib/axiosClient";

export const getAllReviews = () => axiosClient.get("/admin/reviews");

export const deleteReview = (reviewId: number | string) =>
  axiosClient.delete(`/admin/reviews/${reviewId}`);
