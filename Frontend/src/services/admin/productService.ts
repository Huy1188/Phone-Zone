import axiosClient from "@/lib/axiosClient";

// Products list (backend hỗ trợ page/limit/category_id/brand_id)
export const getAllProducts = (params?: {
  page?: number;
  limit?: number;
  category_id?: string | number;
  brand_id?: string | number;
}) => {
  const q = new URLSearchParams();
  if (params?.page) q.set("page", String(params.page));
  if (params?.limit) q.set("limit", String(params.limit));
  if (params?.category_id) q.set("category_id", String(params.category_id));
  if (params?.brand_id) q.set("brand_id", String(params.brand_id));
  const qs = q.toString();
  return axiosClient.get(`/admin/products${qs ? `?${qs}` : ""}`);
};

// backend có /admin/products/create để trả meta categories/brands,
// nhưng FE có thể tự gọi getAllCategories + getAllBrands
export const getCreateProductMeta = () => axiosClient.get("/admin/products/create");

export const getProductById = (productId: number | string) =>
  axiosClient.get(`/admin/products/${productId}`);

export const createProduct = (formData: FormData) =>
  axiosClient.post("/admin/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const updateProduct = (productId: number | string, formData: FormData) =>
  axiosClient.patch(`/admin/products/${productId}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteProduct = (productId: number | string) =>
  axiosClient.delete(`/admin/products/${productId}`);

// Variants
export const createVariant = (productId: number | string, formData: FormData) =>
  axiosClient.post(`/admin/products/${productId}/variants`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

export const deleteVariant = (variantId: number | string) =>
  axiosClient.delete(`/admin/variants/${variantId}`);
