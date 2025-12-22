'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { adminLogin } from '@/services/admin/authService';
import Link from 'next/link';
// Import file SCSS vừa tạo
import styles from './AdminLogin.module.scss';

const AdminLoginForm = () => {
    const router = useRouter();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Gọi API
            let res: any = await adminLogin(email, password);

           if (res?.success) router.push("/admin");
else setError(res.message || "Đăng nhập thất bại");

        } catch (e) {
            setError('Lỗi kết nối Server');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.loginPage}>
            <div className={styles.loginBox}>
                <h2>Admin System</h2>

                {error && (
                    <div className={styles.errorMessage}>
                        <i className="fas fa-exclamation-triangle"></i> {error}
                    </div>
                )}

                <form onSubmit={handleLogin}>
                    <div className={styles.inputGroup}>
                        <label>Email truy cập</label>
                        <div className={styles.inputWrapper}>
                            <i className="fas fa-envelope"></i>
                            <input
                                type="text" // Type text cũng được nhưng email tốt hơn
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="email@admin.com"
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <label>Mật khẩu</label>
                        <div className={styles.inputWrapper}>
                            <i className="fas fa-lock"></i>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Nhập mật khẩu..."
                                required
                            />
                        </div>
                    </div>

                    <button type="submit" className={styles.btnSubmit} disabled={loading}>
                        {loading ? (
                            'Đang xử lý...'
                        ) : (
                            <>
                                Đăng Nhập <i className="fas fa-arrow-right"></i>
                            </>
                        )}
                    </button>
                </form>

                <Link href="/" className={styles.backLink}>
                    <i className="fas fa-home"></i> Quay về trang bán hàng
                </Link>
            </div>
        </div>
    );
};

export default AdminLoginForm;
