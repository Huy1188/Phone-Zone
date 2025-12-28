'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import styles from './AdminSidebar.module.scss';

const AdminSidebar = ({ user, open, onClose }: { user: any; open?: boolean; onClose?: () => void }) => {
    const pathname = usePathname();

    // Hàm helper để check active link
    const isActive = (path: string) => pathname.startsWith(path);

    return (
        <aside className={`${styles.mainSidebar} ${open ? styles.open : ''}`}>
            <div className={styles.mobileTop}>
                <button className={styles.closeBtn} onClick={onClose}>
                    ✕
                </button>
            </div>
            {/* BRAND LOGO */}
            <div className={styles.brandLink}>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                    <i className={`fas fa-store ${styles.logoIcon}`}></i>
                    <span>Phone Zone</span>
                </div>
            </div>

            {/* USER PANEL */}
            <div className={styles.userPanel}>
                <img src={user?.avatar || 'https://cdn-icons-png.flaticon.com/512/2206/2206368.png'} alt="User Image" />
                <div className={styles.info}>
                    <Link href="#">{user ? `${user.last_name} ${user.first_name}` : 'Admin'}</Link>
                </div>
            </div>

            {/* MENU */}
            <ul className={styles.navSidebar}>
                <li className={styles.navItem}>
                    <Link href="/admin" className={`${styles.navLink} ${pathname === '/admin' ? styles.active : ''}`}>
                        <i className="fas fa-tachometer-alt" style={{ color: '#007bff' }}></i>
                        <p>Dashboard</p>
                    </Link>
                </li>

                <li className={styles.navHeader}>HỆ THỐNG</li>
                <li className={styles.navItem}>
                    <Link
                        href="/admin/users"
                        className={`${styles.navLink} ${isActive('/admin/users') ? styles.active : ''}`}
                    >
                        <i className="fas fa-users" style={{ color: '#28a745' }}></i>
                        <p>Người dùng</p>
                    </Link>
                </li>
                <li className={styles.navItem}>
                    <Link
                        href="/admin/reviews"
                        className={`${styles.navLink} ${isActive('/admin/reviews') ? styles.active : ''}`}
                    >
                        <i className="fas fa-star" style={{ color: '#cb27a2ff' }}></i>
                        <p>Đánh giá & Nhận xét</p>
                    </Link>
                </li>

                <li className={styles.navHeader}>KHO & SẢN PHẨM</li>
                <li className={styles.navItem}>
                    <Link
                        href="/admin/categories"
                        className={`${styles.navLink} ${isActive('/admin/categories') ? styles.active : ''}`}
                    >
                        <i className="fas fa-list" style={{ color: '#17a2b8' }}></i>
                        <p>Danh mục</p>
                    </Link>
                </li>
                <li className={styles.navItem}>
                    <Link
                        href="/admin/brands"
                        className={`${styles.navLink} ${isActive('/admin/brands') ? styles.active : ''}`}
                    >
                        <i className="fas fa-tags" style={{ color: '#6610f2' }}></i>
                        <p>Thương hiệu</p>
                    </Link>
                </li>
                <li className={styles.navItem}>
                    <Link
                        href="/admin/products"
                        className={`${styles.navLink} ${isActive('/admin/products') ? styles.active : ''}`}
                    >
                        <i className="fas fa-mobile-alt" style={{ color: '#ffc107' }}></i>
                        <p>Tất cả sản phẩm</p>
                    </Link>
                </li>

                <li className={styles.navHeader}>KINH DOANH</li>
                <li className={styles.navItem}>
                    <Link
                        href="/admin/orders"
                        className={`${styles.navLink} ${isActive('/admin/orders') ? styles.active : ''}`}
                    >
                        <i className="fas fa-shopping-cart" style={{ color: '#dc3545' }}></i>
                        <p>Đơn hàng</p>
                    </Link>
                </li>
                <li className={styles.navItem}>
                    <Link
                        href="/admin/vouchers"
                        className={`${styles.navLink} ${isActive('/admin/vouchers') ? styles.active : ''}`}
                    >
                        <i className="fas fa-ticket-alt" style={{ color: '#e83e8c' }}></i>
                        <p>Mã giảm giá</p>
                    </Link>
                </li>

                <li className={styles.navHeader}>MARKETING</li>
                <li className={styles.navItem}>
                    <Link
                        href="/admin/posts"
                        className={`${styles.navLink} ${isActive('/admin/posts') ? styles.active : ''}`}
                    >
                        <i className="fas fa-newspaper" style={{ color: '#007bff' }}></i>
                        <p>Tin tức / Blog</p>
                    </Link>
                </li>
                <li className={styles.navItem}>
                    <Link
                        href="/admin/banners"
                        className={`${styles.navLink} ${isActive('/admin/banners') ? styles.active : ''}`}
                    >
                        <i className="fas fa-images" style={{ color: '#d09445ff' }}></i>
                        <p>Quản lý Banner</p>
                    </Link>
                </li>
            </ul>
        </aside>
    );
};
export default AdminSidebar;
