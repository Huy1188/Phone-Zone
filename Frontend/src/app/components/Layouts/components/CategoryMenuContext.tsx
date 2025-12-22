'use client';

import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';

type CategoryMenuContextValue = {
    isOpen: boolean;
    openMenu: () => void;
    closeMenu: () => void;
    toggleMenu: () => void;
};

const CategoryMenuContext = createContext<CategoryMenuContextValue | null>(null);

export function CategoryMenuProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const pathname = usePathname();

    // Close menu on route change (GearVN-like behavior)
    useEffect(() => {
        setIsOpen(false);
    }, [pathname]);

    // Close on ESC
    useEffect(() => {
        if (!isOpen) return;
        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setIsOpen(false);
        };
        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen]);

    // Optional: prevent background scroll when menu open
    useEffect(() => {
        if (!isOpen) {
            document.body.style.overflow = '';
            return;
        }
        document.body.style.overflow = 'hidden';
        return () => {
            document.body.style.overflow = '';
        };
    }, [isOpen]);

    const value = useMemo<CategoryMenuContextValue>(
        () => ({
            isOpen,
            openMenu: () => setIsOpen(true),
            closeMenu: () => setIsOpen(false),
            toggleMenu: () => setIsOpen((v) => !v),
        }),
        [isOpen],
    );

    return <CategoryMenuContext.Provider value={value}>{children}</CategoryMenuContext.Provider>;
}

export function useCategoryMenu() {
    const ctx = useContext(CategoryMenuContext);
    if (!ctx) throw new Error('useCategoryMenu must be used within CategoryMenuProvider');
    return ctx;
}
