import { api } from "@/lib/api";
import type { AuthResponse } from "@/services/auth";

export type UpdateMePayload = {
  username?: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  gender?: "male" | "female" | ""; // FE gửi string cho dễ
  avatar?: string; // nếu bạn cho user nhập url avatar
};

export async function updateMe(payload: UpdateMePayload) {
  return api<AuthResponse>("/users/me", {
    method: "PUT",
    body: payload as any,
  });
}
