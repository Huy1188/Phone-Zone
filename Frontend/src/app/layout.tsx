
import type { Metadata } from 'next';
import './globals.css';
import DefaultLayout from './components/Layouts/DefaultLayout';
import { CartProvider } from '@/hooks/useCart';
import { AuthProvider } from '@/hooks/useAuth';
import '@fortawesome/fontawesome-free/css/all.min.css';

export const metadata: Metadata = {
    title: 'Phone Zone',
    description: 'Mua điện thoại, laptop, PC chính hãng, giá tốt, trả góp 0% tại Phone Zone.',
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="vi">
            <head>
                
                {}
                {}
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
                    rel="stylesheet"
                ></link>
                {}
            </head>
            <body>
                <AuthProvider>
                    <CartProvider>
                        <DefaultLayout>{children}</DefaultLayout>
                    </CartProvider>
                </AuthProvider>
            </body>
        </html>
    );
}
