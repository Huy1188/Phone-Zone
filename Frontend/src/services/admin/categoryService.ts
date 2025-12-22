import axiosClient from "@/lib/axiosClient";

export const getAllCategories = () => axiosClient.get("/admin/categories");

// route này backend có, nhưng FE thường không cần (chỉ dùng để render page server-side)
// export const getCreateCategoryMeta = () => axiosClient.get("/admin/categories/create");

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
