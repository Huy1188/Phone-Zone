'use client';
import { useEffect, useState } from 'react';
import { getDashboardStats } from '@/services/admin/systemService';
import { DashboardStats } from '@/types/dashboard';
import Link from 'next/link';
// Import file SCSS
import styles from './Dashboard.module.scss';

const DashboardMain = () => {
    const [stats, setStats] = useState<DashboardStats | null>(null);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                let res: any = await getDashboardStats();
                if (res?.success) {
                    setStats(res.data);
                }
            } catch (error) {
                console.error('Lỗi lấy thống kê:', error);
            }
        };
        fetchStats();
    }, []);

    if (!stats) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

    // Component con (đã dùng class SCSS)
    // typeColor nhận vào: 'blue' | 'green' | 'yellow' | 'purple'
    const StatCard = ({ title, count, typeColor, icon, link }: any) => (
        <Link href={link || '#'} className={styles.statLink}>
            {' '}
            {/* Bọc thẻ Link ở ngoài cùng */}
            <div className={`${styles.statCard} ${styles[typeColor]}`}>
                <div className={styles.cardInfo}>
                    <span className={styles.cardLabel}>{title}</span>
                    <span className={styles.cardCount}>{count}</span>
                </div>
                <div className={styles.cardIcon}>
                    <i className={`fas ${icon}`}></i>
                </div>
            </div>
        </Link>
    );

    return (
        <div className={styles.dashboardContainer}>
            <h1 className={styles.pageTitle}>Tổng quan hệ thống</h1>

            <div className={styles.statsGrid}>
                {/* 🔥 3. Truyền thêm prop link="/admin/..." tương ứng */}
                <StatCard
                    title="Khách hàng"
                    count={stats.userCount}
                    typeColor="blue"
                    icon="fa-users"
                    link="/admin/users"
                />

                <StatCard
                    title="Sản phẩm"
                    count={stats.productCount}
                    typeColor="green"
                    icon="fa-mobile-alt"
                    link="/admin/products"
                />

                <StatCard
                    title="Đơn hàng"
                    count={stats.orderCount}
                    typeColor="yellow"
                    icon="fa-shopping-cart"
                    link="/admin/orders"
                />

                <StatCard
                    title="Bài viết"
                    count={stats.postCount}
                    typeColor="purple"
                    icon="fa-newspaper"
                    link="/admin/posts"
                />
            </div>

            <div className={styles.chartSection}>(Khu vực biểu đồ doanh thu sẽ nằm ở đây)</div>
        </div>
    );
};

export default DashboardMain;
