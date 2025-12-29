'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { adminLogout } from '@/services/admin/authService';
import { useRouter } from 'next/navigation';
import ChangePasswordModal from '@/app/components/Admin/Auth/ChangePasswordModal'; 
import styles from './AdminHeader.module.scss';

const AdminHeader = ({ user, onToggleSidebar }: { user: any, onToggleSidebar?: () => void }) => {
    const [isOpen, setIsOpen] = useState(false);

    
    const [showChangePass, setShowChangePass] = useState(false);

    const dropdownRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    
    useEffect(() => {
        const handleClickOutside = (event: any) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await adminLogout();
        router.push('/admin/login');
    };

    return (
        <>
            <header className={styles.adminHeader}>
                <button className={styles.menuBtn} onClick={onToggleSidebar} aria-label="Toggle sidebar">
                    <i className="fas fa-bars" />
                </button>
                {}
                <div className={styles.headerLeft}>
                    <Link href="/" target="_blank">
                        <i className="fas fa-globe" style={{ marginRight: 5 }}></i> Xem Website
                    </Link>
                    <span>|</span>
                    <span>Quản trị hệ thống</span>
                </div>

                {}
                <div className={styles.headerRight}>
                    {}
                    <div className={styles.navIconBtn}>
                        <i className="far fa-bell"></i>
                        <span className={styles.badge}>3</span>
                    </div>
                    <div className={styles.navIconBtn}>
                        <i className="far fa-envelope"></i>
                        <span className={styles.badge} style={{ background: '#28a745' }}>
                            5
                        </span>
                    </div>

                    {}
                    <div className={styles.adminProfile} onClick={() => setIsOpen(!isOpen)} ref={dropdownRef}>
                        <img
                            src={user?.avatar || 'https://cdn-icons-png.flaticon.com/512/2206/2206368.png'}
                            className={styles.avatar}
                            alt="Admin"
                        />
                        <div>
                            <span className={styles.name}>{user ? user.last_name : 'Admin'}</span>
                            <i
                                className={`fas fa-angle-down`}
                                style={{
                                    marginLeft: 5,
                                    fontSize: 12,
                                    transform: isOpen ? 'rotate(180deg)' : 'rotate(0)',
                                }}
                            ></i>
                        </div>

                        {}
                        <div className={`${styles.dropdownMenu} ${isOpen ? styles.show : ''}`}>
                            <div className={styles.menuHeader}>
                                <small>Đăng nhập bởi:</small>
                                <br />
                                <strong>{user ? `${user.last_name} ${user.first_name}` : 'Super Admin'}</strong>
                            </div>

                            {}
                            {}
                            <div
                                className={styles.dropdownItem}
                                onClick={(e) => {
                                    e.stopPropagation(); 
                                    setIsOpen(false); 
                                    setShowChangePass(true); 
                                }}
                                style={{ cursor: 'pointer' }}
                            >
                                <i className="fas fa-key" style={{ color: '#ffc107' }}></i> Đổi mật khẩu
                            </div>

                            <div style={{ borderTop: '1px solid #eee' }}></div>

                            <div
                                onClick={handleLogout}
                                className={styles.dropdownItem}
                                style={{ cursor: 'pointer', color: '#dc3545' }}
                            >
                                <i className="fas fa-sign-out-alt"></i> Đăng xuất
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            {}
            <ChangePasswordModal isOpen={showChangePass} onClose={() => setShowChangePass(false)} />
        </>
    );
};
export default AdminHeader;
