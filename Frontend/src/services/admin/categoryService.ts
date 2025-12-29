import axiosClient from "@/lib/axiosClient";

export const getAllCategories = () => axiosClient.get("/admin/categories");




export const getCategoryById = (categoryId: number | string) =>
  axiosClient.get(`/admin/categories/${categoryId}`);

export const createCategory = (formData: FormData) =>
  axiosClient.post("/admin/categories", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateCategory = (categoryId: number | string, formData: FormData) =>
  axiosClient.patch(`/admin/categories/${categoryId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteCategory = (categoryId: number | string) =>
  axiosClient.delete(`/admin/categories/${categoryId}`);
