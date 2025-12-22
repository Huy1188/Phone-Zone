import axiosClient from '@/lib/axiosClient';

export const getAllOrders = (params?: {
  page?: number;
  limit?: number;
  status?: string;
}) => {
  const q = new URLSearchParams();
  if (params?.page) q.set('page', String(params.page));
  if (params?.limit) q.set('limit', String(params.limit));
  if (params?.status) q.set('status', String(params.status));

  const qs = q.toString();
  return axiosClient.get(`/admin/orders${qs ? `?${qs}` : ''}`);
};

export const getOrderById = (orderId: number) => {
  return axiosClient.get(`/admin/orders/${orderId}`);
};

export const updateOrderStatus = (orderId: number, status: string) => {
  return axiosClient.put(`/admin/orders/${orderId}/status`, { status });
};

export const deleteOrder = (orderId: number) => {
  return axiosClient.delete(`/admin/orders/${orderId}`);
};

export const getInvoiceData = (orderId: number) => {
  return axiosClient.get(`/admin/orders/${orderId}/invoice`);
};
