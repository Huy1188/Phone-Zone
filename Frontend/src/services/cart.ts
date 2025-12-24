import axios from "axios";
import { SessionCartItem } from "@/types/backend";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000/api",
  withCredentials: true,
});

export type GetCartResponse = {
  cart: SessionCartItem[];
  totalMoney: number;
};

type MutateResponse = {
  success: boolean;
  message?: string;
};

export const getCart = async () => {
  const { data } = await api.get<GetCartResponse>("/cart");
  return data;
};

export const addCartItem = async (payload: { variantId: number; quantity: number }) => {
  const { data } = await api.post<MutateResponse>("/cart/items", {
    variant_id: payload.variantId,
    quantity: payload.quantity,
  });
  return data;
};

export const updateCartItemQuantity = async (payload: { variantId: number; quantity: number }) => {
  const { data } = await api.patch<MutateResponse>(`/cart/items/${payload.variantId}`, {
    quantity: payload.quantity,
  });
  return data;
};

export const deleteCartItem = async (variantId: number) => {
  const { data } = await api.delete<MutateResponse>(`/cart/items/${variantId}`);
  return data;
};
