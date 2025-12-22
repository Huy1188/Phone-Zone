import axiosClient from "@/lib/axiosClient";

export const getAllVouchers = () => axiosClient.get("/admin/vouchers");

// export const getCreateVoucherMeta = () => axiosClient.get("/admin/vouchers/create");

export const createVoucher = (payload: any) =>
  axiosClient.post("/admin/vouchers", payload);

export const getVoucherById = (voucherId: number | string) =>
  axiosClient.get(`/admin/vouchers/${voucherId}`);

export const updateVoucher = (voucherId: number | string, payload: any) =>
  axiosClient.patch(`/admin/vouchers/${voucherId}`, payload);

export const deleteVoucher = (voucherId: number | string) =>
  axiosClient.delete(`/admin/vouchers/${voucherId}`);
