import { Metadata } from 'next';
import DashboardMain from '@/app/components/Admin/Dashboard/DashboardMain';

export const metadata: Metadata = {
    title: 'Dashboard - Quản trị Phone Zone',
};

export default function DashboardPage() {
    return <DashboardMain />;
}
