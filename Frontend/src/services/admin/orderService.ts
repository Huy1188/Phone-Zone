import axiosClient from '@/lib/axiosClient';
import { axiosDownload } from "@/lib/axiosDownload";

export const getAllOrders = (params?: { page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    const qs = q.toString();
    return axiosClient.get(`/admin/orders${qs ? `?${qs}` : ''}`);
};

export const getOrderById = (orderId: number | string) => axiosClient.get(`/admin/orders/${orderId}`);

export const updateOrderStatus = (id: number, status: string) => {
  // axiosClient interceptor đã return data rồi => không .data nữa
  return axiosClient.patch(`/admin/orders/${id}/status`, { status });
};

export const deleteOrder = (orderId: number) => {
    return axiosClient.delete(`/admin/orders/${orderId}`);
};

export const getInvoiceData = (orderId: number) => {
    return axiosClient.get(`/admin/orders/${orderId}/invoice`);
};

export const downloadInvoice = (id: number) => {
  return axiosClient.get(`/admin/orders/${id}/invoice`, {
    responseType: "blob",
  } as any);
};
