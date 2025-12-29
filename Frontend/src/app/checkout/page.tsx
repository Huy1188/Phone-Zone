"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import CheckoutPage from "@/app/components/Pages/Checkout"; 

export default function CheckoutRoutePage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      router.replace(`/login?redirect=/checkout`);
    }
  }, [loading, user, router]);

  if (loading) return null;   
  if (!user) return null;      

  return <CheckoutPage />;
}
