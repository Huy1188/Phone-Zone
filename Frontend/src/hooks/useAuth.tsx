"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { me, logout, type AuthUser } from "@/services/auth";

type AuthContextValue = {
  user: AuthUser | null;
  hydrated: boolean;
  loading: boolean
  refreshMe: () => Promise<void>;
  logoutUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [hydrated, setHydrated] = useState(false);

  const [loading, setLoading] = useState(true);

const refreshMe = async () => {
  setLoading(true);
  try {
    const res = await me();
    setUser(res.user ?? null);
  } finally {
    setHydrated(true);
    setLoading(false);
  }
};

  const logoutUser = async () => {
    await logout();
    setUser(null);
  };

  useEffect(() => {
    refreshMe().catch(() => setHydrated(true));
  }, []);


  return (
    <AuthContext.Provider value={{ user, hydrated, loading , refreshMe, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
