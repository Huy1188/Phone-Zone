// src/services/cart.ts
import { api } from "@/lib/api";
import { SessionCartItem, GetCartResponse } from "@/types/backend";


export async function getCart() {
  return api<GetCartResponse>("/cart", { method: "GET", cache: "no-store" });
}

export async function addToCart(payload: { variant_id: number; quantity: number }) {
  return api<{ success: boolean; cart: SessionCartItem[]; message?: string }>("/cart/items", {
    method: "POST",
    body: payload as any,
  });
}

export async function deleteCartItem(variantId: number) {
  return api<{ success: boolean; cart: SessionCartItem[]; message?: string }>(`/cart/items/${variantId}`, {
    method: "DELETE",
  });
}
