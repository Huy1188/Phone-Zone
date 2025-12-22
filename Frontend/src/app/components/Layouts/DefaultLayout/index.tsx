'use client';
import Header from "../components/Header";
import Footer from "../components/Footer";
import MobileBottomNav from "../components/MobileBottomNav";
import { CategoryMenuProvider } from "../components/CategoryMenuContext";
import { usePathname } from 'next/navigation';

function DefaultLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>){
  const pathname = usePathname();
  const isAdmin = pathname.startsWith('/admin');
    return (
        <CategoryMenuProvider>
            <div className="wrapper">
                {!isAdmin && <Header />}
                <main className="container">{children}</main>
                {!isAdmin && <Footer />}
                <MobileBottomNav />
            </div>
        </CategoryMenuProvider>
    )
}

export default DefaultLayout