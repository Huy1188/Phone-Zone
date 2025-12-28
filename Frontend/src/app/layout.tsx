
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
                
                {/* Dùng local Font Awesome */}
                {/* <link rel="stylesheet" href="/fonts/fontawesome/css/all.min.css" /> */}
                <link
                    href="https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100..900;1,100..900&display=swap"
                    rel="stylesheet"
                ></link>
                {/* <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"></link>
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"></link>
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"></link>
                <link rel="manifest" href="/site.webmanifest"></link> */}
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
