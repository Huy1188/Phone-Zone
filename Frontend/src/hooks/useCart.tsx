"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { addToCart, deleteCartItem, getCart } from "@/services/cart";
import { SessionCartItem } from "@/types/backend";

type CartContextValue = {
  items: SessionCartItem[];
  hydrated: boolean;

  totalItems: number;
  totalPrice: number;

  refresh: () => Promise<void>;
  addItemByVariant: (variantId: number, quantity?: number) => Promise<void>;
  removeItem: (variantId: number) => Promise<void>;
  updateQuantity: (variantId: number, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<SessionCartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  const refresh = async () => {
    const res = await getCart();
    setItems(res.cart ?? []);
    setHydrated(true);
  };

  useEffect(() => {
    refresh().catch(() => setHydrated(true));
  }, []);

  const addItemByVariant = async (variantId: number, quantity = 1) => {
    const res = await addToCart({ variant_id: variantId, quantity });
    setItems(res.cart ?? []);
  };

  const removeItem = async (variantId: number) => {
    const res = await deleteCartItem(variantId);
    setItems(res.cart ?? []);
  };

  // ⚠️ BE chưa có endpoint update quantity
  // ✅ workaround: xoá rồi add lại với quantity mới
  const updateQuantity = async (variantId: number, quantity: number) => {
    await deleteCartItem(variantId);
    if (quantity > 0) {
      const res = await addToCart({ variant_id: variantId, quantity });
      setItems(res.cart ?? []);
    } else {
      await refresh();
    }
  };

  const clearCart = async () => {
    for (const it of items) {
      await deleteCartItem(it.variantId);
    }
    await refresh();
  };

  const totalItems = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);
  const totalPrice = useMemo(() => items.reduce((s, i) => s + i.price * i.quantity, 0), [items]);

  const value: CartContextValue = {
    items,
    hydrated,
    totalItems,
    totalPrice,
    refresh,
    addItemByVariant,
    removeItem,
    updateQuantity,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
