import { Metadata } from 'next';
// Import Component Logic
import AdminLoginForm from '@/app/components/Admin/Login/AdminLoginForm';

export const metadata: Metadata = {
    title: 'Đăng nhập Quản trị viên',
};

export default function AdminLoginPage() {
    return <AdminLoginForm />;
}
