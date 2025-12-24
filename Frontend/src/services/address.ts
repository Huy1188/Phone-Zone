import { api } from "@/lib/api";

export type Address = {
  address_id: number;
  user_id: number;
  recipient_name: string;
  recipient_phone: string;
  street: string;
  city: string;
  is_default: boolean;
  created_at?: string;
  updated_at?: string;
};

type ListRes = { success: boolean; addresses: Address[]; message?: string };
type DefaultRes = { success: boolean; address: Address | null; message?: string };

export function getMyAddresses() {
  return api<ListRes>("/users/me/addresses", { method: "GET", cache: "no-store" });
}
export function createAddress(payload: Partial<Address>) {
  return api<ListRes>("/users/me/addresses", { method: "POST", body: payload as any });
}
export function updateAddress(id: number, payload: Partial<Address>) {
  return api<ListRes>(`/users/me/addresses/${id}`, { method: "PUT", body: payload as any });
}
export function deleteAddress(id: number) {
  return api<ListRes>(`/users/me/addresses/${id}`, { method: "DELETE" });
}
export function setDefaultAddress(id: number) {
  return api<ListRes>(`/users/me/addresses/${id}/default`, { method: "PATCH" });
}
export function getDefaultAddress() {
  return api<DefaultRes>("/users/me/addresses/default", { method: "GET", cache: "no-store" });
}
