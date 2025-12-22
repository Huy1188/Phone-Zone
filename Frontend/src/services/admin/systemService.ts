import axiosClient from "@/lib/axiosClient";

export const getDashboardStats = () => axiosClient.get("/admin/dashboard");
