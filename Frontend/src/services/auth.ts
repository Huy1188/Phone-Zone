// src/services/auth.ts
import { api } from "@/lib/api";

export type AuthUser = {
  user_id: number;
  email: string;
  role_id?: number;

  username?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  gender?: boolean | null;
  phone?: string | null;
  avatar?: string | null;

  is_active?: boolean | null;
  createdAt?: string;
  updatedAt?: string;
};
export type AuthResponse = {
  success: boolean;
  message?: string;
  user?: AuthUser;
};

export async function register(payload: { username?: string; email: string; password: string }) {
  return api<AuthResponse>("/auth/register", {
    method: "POST",
    body: payload as any,
  });
}

export async function login(payload: { email: string; password: string }) {
  return api<AuthResponse>("/auth/login", {
    method: "POST",
    body: payload as any,
  });
}

export async function me() {
  return api<AuthResponse>("/auth/me", {
    method: "GET",
    cache: "no-store",
  });
}

export async function logout() {
  return api<AuthResponse>("/auth/logout", {
    method: "POST",
  });
}
