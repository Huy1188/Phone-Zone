'use client';

import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import Link from 'next/link';
import styles from './AuthLayout.module.scss';
import { useRouter, useSearchParams } from 'next/navigation';
import { login, register } from '@/services/auth';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

const cx = classNames.bind(styles);

type Mode = 'login' | 'register';

interface AuthLayoutProps {
    defaultMode?: Mode;
}

export default function AuthLayout({ defaultMode = 'login' }: AuthLayoutProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const redirect = searchParams.get('redirect') || '/';

    const { refreshMe: refreshAuth } = useAuth();
    const { refresh: refreshCart } = useCart();

    const [mode, setMode] = useState<Mode>(defaultMode);

    useEffect(() => {
        setMode(defaultMode);
    }, [defaultMode]);

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth <= 1023);
        check();
        window.addEventListener('resize', check);
        return () => window.removeEventListener('resize', check);
    }, []);

    const isSignUp = mode === 'register';

    // Register state
    const [regUsername, setRegUsername] = useState('');
    const [regEmail, setRegEmail] = useState('');
    const [regPassword, setRegPassword] = useState('');

    // Login state
    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState<string | null>(null);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            const res = await register({
                username: regUsername || undefined,
                email: regEmail,
                password: regPassword,
            });

            if (!res?.success) throw new Error(res?.message || 'Đăng ký thất bại');

            // đăng ký xong chuyển qua login
            setMode('login');
        } catch (error: any) {
            setErr(error?.message || 'Đăng ký lỗi');
        } finally {
            setLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErr(null);
        setLoading(true);
        try {
            const res = await login({ email: loginEmail, password: loginPassword });

            if (!res?.success) throw new Error(res?.message || 'Đăng nhập thất bại');
            await refreshAuth(); // cập nhật user
            await refreshCart(); // ✅ cập nhật cart ngay để Navbar đổi liền
            router.push(redirect);
            // router.refresh();
        } catch (error: any) {
            setErr(error?.message || 'Đăng nhập lỗi');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className={cx('authPage')}>
            <div className={cx('container', { rightPanelActive: isSignUp })}>
                {/* FORM ĐĂNG KÝ */}
                <div className={cx('formContainer', 'signUpContainer')}>
                    <form className={cx('authForm')} onSubmit={handleRegister}>
                        <h1>TẠO TÀI KHOẢN</h1>

                        <input
                            type="text"
                            placeholder="Họ và tên"
                            value={regUsername}
                            onChange={(e) => setRegUsername(e.target.value)}
                            required
                        />
                        <input
                            type="email"
                            placeholder="Email"
                            value={regEmail}
                            onChange={(e) => setRegEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={regPassword}
                            onChange={(e) => setRegPassword(e.target.value)}
                            required
                        />

                        {err && isSignUp && <p className={cx('error')}>{err}</p>}

                        <button type="submit" disabled={loading}>
                            {loading && isSignUp ? 'Đang xử lý...' : 'Đăng ký'}
                        </button>

                        {isMobile && (
                            <div className={cx('switchAuth')}>
                                <span>Bạn đã có tài khoản?</span>
                                <button
                                    type="button"
                                    className={cx('switchLink')}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setErr(null);
                                        setMode('login');
                                    }}
                                >
                                    Đăng nhập ngay!
                                </button>
                            </div>
                        )}
                    </form>
                </div>

                {/* FORM ĐĂNG NHẬP */}
                <div className={cx('formContainer', 'signInContainer')}>
                    <form className={cx('authForm')} onSubmit={handleLogin}>
                        <h1>ĐĂNG NHẬP</h1>

                        <input
                            type="email"
                            placeholder="Email"
                            value={loginEmail}
                            onChange={(e) => setLoginEmail(e.target.value)}
                            required
                        />
                        <input
                            type="password"
                            placeholder="Mật khẩu"
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            required
                        />

                        <Link href="#">Quên mật khẩu?</Link>

                        {err && !isSignUp && <p className={cx('error')}>{err}</p>}

                        {isMobile && (
                            <div className={cx('switchAuth')}>
                                <span>Bạn chưa có tài khoản?</span>
                                <button
                                    type="button"
                                    className={cx('switchLink')}
                                    onClick={(e) => {
                                        e.preventDefault();
                                        setErr(null);
                                        setMode('register');
                                    }}
                                >
                                    Đăng kí ngay!
                                </button>
                            </div>
                        )}

                        <button type="submit" disabled={loading}>
                            {loading && !isSignUp ? 'Đang xử lý...' : 'Đăng nhập'}
                        </button>
                    </form>
                </div>

                {/* OVERLAY SLIDE */}
                <div className={cx('overlayContainer')}>
                    <div className={cx('overlay')}>
                        <div className={cx('overlayPanel', 'overlayLeft')}>
                            <h1>Chào mừng trở lại!</h1>
                            <p>Đăng nhập để tiếp tục mua sắm tại Phone Zone.</p>
                            <button
                                type="button"
                                className={cx('ghost')}
                                onClick={() => {
                                    setErr(null);
                                    setMode('login');
                                }}
                            >
                                Đăng nhập
                            </button>
                        </div>

                        <div className={cx('overlayPanel', 'overlayRight')}>
                            <h1>Xin chào, bạn mới!</h1>
                            <p>Tạo tài khoản để nhận nhiều ưu đãi hơn tại Phone Zone.</p>
                            <button
                                type="button"
                                className={cx('ghost')}
                                onClick={() => {
                                    setErr(null);
                                    setMode('register');
                                }}
                            >
                                Đăng ký
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
