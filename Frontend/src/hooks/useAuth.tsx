"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { me, logout } from "@/services/auth";
import { User } from "@/types/user";

const AuthContext = createContext<{
  user: User | null;
  refresh: () => Promise<void>;
  logoutUser: () => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  const refresh = async () => {
    try {
      const res = await me();
      setUser(res?.user ?? null);
    } catch {
      setUser(null);
    }
  };

  const logoutUser = async () => {
    await logout();
    setUser(null);
  };

  useEffect(() => {
    refresh();
  }, []);

  return (
    <AuthContext.Provider value={{ user, refresh, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
