import axiosClient from "@/lib/axiosClient";

export const getAllUsers = () => axiosClient.get("/admin/users");

export const getUserById = (userId: number | string) =>
  axiosClient.get(`/admin/users/${userId}`);

export const createNewUser = (payload: any) =>
  axiosClient.post("/admin/users", payload);

export const updateUser = (userId: number | string, payload: any) =>
  axiosClient.patch(`/admin/users/${userId}`, payload);

export const deleteUser = (userId: number | string) =>
  axiosClient.delete(`/admin/users/${userId}`);

export const deleteAddress = (addressId: number | string) =>
  axiosClient.delete(`/admin/addresses/${addressId}`);
