// src/app/admin/layout.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Hệ thống Quản trị - Phone Zone',
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        // Chỉ render children, không có Sidebar ở đây
        <section className="admin-root">{children}</section>
    );
}
