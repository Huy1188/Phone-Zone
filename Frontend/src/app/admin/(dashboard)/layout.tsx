'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkAdminAuth } from '@/services/admin/authService';
import AdminSidebar from '@/app/components/Admin/Sidebar';
import AdminHeader from '@/app/components/Admin/Header';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const res: any = await checkAdminAuth();

        // BE session trả: { success, data: { loggedIn, adminUser } }
        const loggedIn = !!res?.data?.loggedIn;
        const adminUser = res?.data?.adminUser ?? null;

        if (res?.success && loggedIn && adminUser) {
          setIsAuth(true);
          setUser(adminUser);
        } else {
          router.push('/admin/login');
        }
      } catch (e) {
        router.push('/admin/login');
      }
    };

    checkLogin();
  }, [router]);

  if (!isAuth) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f9' }}>
      <AdminSidebar user={user} />
      <div style={{ flex: 1, marginLeft: '250px', display: 'flex', flexDirection: 'column' }}>
        <AdminHeader user={user} />
        <main style={{ padding: '20px', flex: 1 }}>{children}</main>
      </div>
    </div>
  );
}
