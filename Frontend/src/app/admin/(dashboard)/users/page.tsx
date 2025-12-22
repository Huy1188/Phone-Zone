import { Metadata } from 'next';
import UserManage from '@/app/components/Admin/Users/UserManage';

export const metadata: Metadata = {
    title: 'Quản lý thành viên',
};

export default function UsersPage() {
    return <UserManage />;
}
