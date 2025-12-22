"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import CheckoutPage from "@/app/components/Pages/Checkout"; // đổi path theo dự án bạn

export default function CheckoutRoutePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=/checkout`);
    }
  }, [loading, user, router]);

  if (loading) return null;   // hoặc skeleton
  if (!user) return null;      // đang redirect

  return <CheckoutPage />;
}
