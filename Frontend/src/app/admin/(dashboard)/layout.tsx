'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAdminAuth } from '@/services/admin/authService';
import AdminSidebar from '@/app/components/Admin/Sidebar';
import AdminHeader from '@/app/components/Admin/Header';
import styles from './AdminDashboardLayout.module.scss';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<any>(null);

  // NEW
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res: any = await checkAdminAuth();
        if (!res?.success) {
          router.push('/admin/login');
          return;
        }
        setUser(res?.data?.user);
        setIsAuth(true);
      } catch {
        router.push('/admin/login');
      }
    };
    checkLogin();
  }, [router]);

  if (!isAuth) return null;

  return (
    <div className={styles.wrapper}>
      <AdminSidebar user={user} open={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      <div className={styles.content}>
        <AdminHeader user={user} onToggleSidebar={() => setSidebarOpen(v => !v)} />
        <main className={styles.main}>{children}</main>
      </div>

      {/* overlay mobile */}
      {sidebarOpen && <div className={styles.overlay} onClick={() => setSidebarOpen(false)} />}
    </div>
  );
}
