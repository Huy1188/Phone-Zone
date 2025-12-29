
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Hệ thống Quản trị - Phone Zone',
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
    return (
        
        <section className="admin-root">{children}</section>
    );
}
