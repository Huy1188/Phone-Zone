import axiosClient from "@/lib/axiosClient";

export const getAllBanners = () => axiosClient.get("/admin/banners");

export const getBannerById = (bannerId: number | string) =>
  axiosClient.get(`/admin/banners/${bannerId}`);

export const createBanner = (formData: FormData) =>
  axiosClient.post("/admin/banners", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateBanner = (bannerId: number | string, formData: FormData) =>
  axiosClient.put(`/admin/banners/${bannerId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteBanner = (bannerId: number | string) =>
  axiosClient.delete(`/admin/banners/${bannerId}`);
