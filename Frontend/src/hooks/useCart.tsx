'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { addCartItem, deleteCartItem, getCart, updateCartItemQuantity } from '@/services/cart';
import { SessionCartItem } from '@/types/backend';

type CartContextValue = {
    items: SessionCartItem[];
    hydrated: boolean;

    totalItems: number;

    // ✅ thêm
    totalMoney: number;

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
    const [totalMoney, setTotalMoney] = useState(0);

    const refresh = async () => {
        try {
            const res = await getCart();
            setItems(res.cart ?? []);
            setTotalMoney(Number(res.totalMoney ?? 0)); // ✅ thêm dòng này
        } finally {
            setHydrated(true);
        }
    };

    useEffect(() => {
        refresh().catch(() => setHydrated(true));
    }, []);

    const addItemByVariant = async (variantId: number, quantity = 1) => {
        await addCartItem({ variantId, quantity });
        await refresh();
    };

    const removeItem = async (variantId: number) => {
        await deleteCartItem(variantId);
        await refresh();
    };

    const updateQuantity = async (variantId: number, quantity: number) => {
        if (quantity < 1) {
            await removeItem(variantId);
            return;
        }
        await updateCartItemQuantity({ variantId, quantity });
        await refresh();
    };

    const clearCart = async () => {
        for (const it of items) {
            await deleteCartItem(it.variantId);
        }
        await refresh();
    };

    const totalItems = useMemo(() => items.reduce((s, i) => s + i.quantity, 0), [items]);

    return (
        <CartContext.Provider
            value={{
                items,
                hydrated,
                totalItems,
                totalMoney,
                refresh,
                addItemByVariant,
                removeItem,
                updateQuantity,
                clearCart,
            }}
        >
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const ctx = useContext(CartContext);
    if (!ctx) throw new Error('useCart must be used inside <CartProvider>');
    return ctx;
}
