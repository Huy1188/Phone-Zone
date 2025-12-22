import axiosClient from "@/lib/axiosClient";

export const getAllBrands = () => axiosClient.get("/admin/brands");

// export const getCreateBrandMeta = () => axiosClient.get("/admin/brands/create");

export const getBrandById = (brandId: number | string) =>
  axiosClient.get(`/admin/brands/${brandId}`);

export const createBrand = (formData: FormData) =>
  axiosClient.post("/admin/brands", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateBrand = (brandId: number | string, formData: FormData) =>
  axiosClient.patch(`/admin/brands/${brandId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteBrand = (brandId: number | string) =>
  axiosClient.delete(`/admin/brands/${brandId}`);
