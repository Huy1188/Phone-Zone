// src/services/order.ts
import { api } from "@/lib/api";
import { CreateOrderPayload, CreateOrderResponse } from "@/types/backend";


export async function createOrder(payload: CreateOrderPayload) {
  return api<CreateOrderResponse>("/orders", {
    method: "POST",
    body: payload as any,
  });
}

export async function getMyOrders() {
  return api<{ success: boolean; orders: any[] }>("/orders/me", {
    method: "GET",
    cache: "no-store",
  });
}
