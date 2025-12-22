import axiosClient from "@/lib/axiosClient";

export const checkAdminAuth = () => axiosClient.get("/admin/auth");

export const adminLogin = (email: string, password: string) =>
  axiosClient.post("/admin/login", { email, password });

export const adminLogout = () => axiosClient.post("/admin/logout");

export const changeAdminPassword = (payload: {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => axiosClient.post("/admin/change-password", payload);
