'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useDebounce } from '@/hooks/useDebounce';

import { useCart } from '@/hooks/useCart';
import { useAuth } from '@/hooks/useAuth';
import { useSearchParams } from 'next/navigation';

import classNames from 'classnames/bind';
import styles from './Navbar.module.scss';
import Image from 'next/image';
import Link from 'next/link';

import DropMenu from './DropMenu';
import SearchSuggest from './SearchSuggest';
import LoginSuggest from './LoginSuggest';
import { useCategoryMenu } from '../../CategoryMenuContext';

const cx = classNames.bind(styles);

function Navbar() {
    const router = useRouter();
    const searchWrapRef = useRef<HTMLDivElement>(null);

    const { user, logoutUser } = useAuth();
    const displayName = (() => {
        if (!user) return '';

        const first = user.first_name?.trim();
        const last = user.last_name?.trim();

        // Ưu tiên: last_name + first_name
        if (first && last) {
            return last;
        }

        // fallback: username
        if (user.username) return user.username;

        // fallback cuối: email
        if (user.email) return user.email.split('@')[0];

        return 'User';
    })();

    const [keyword, setKeyword] = useState('');
    const debouncedKeyword = useDebounce(keyword, 300);
    const inputRef = useRef<HTMLInputElement>(null);
    const [isFocused, setIsFocused] = useState(false);

    const searchParams = useSearchParams();

    useEffect(() => {
        const q = searchParams.get('q'); // ✅ đổi keyword -> q
        if (q) setKeyword(q);
    }, [searchParams]);

    const [isSearchOpen, setIsSearchOpen] = useState(false);

    const { isOpen: isMenuOpen, toggleMenu, closeMenu } = useCategoryMenu();

    const { totalItems } = useCart();

    const pathname = usePathname();

    const handleToggleMenu = () => {
        toggleMenu();
        setIsSearchOpen(false);
    };

    // đóng menu khi đổi trang
    useEffect(() => {
        closeMenu();
        setIsSearchOpen(false);
        setIsFocused(false);
        inputRef.current?.blur();
    }, [pathname]);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (!searchWrapRef.current) return;
            if (!searchWrapRef.current.contains(e.target as Node)) {
                setIsSearchOpen(false);
                setIsFocused(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <>
            <div className={cx('navbar')}>
                <div className={cx('container-fluid')}>
                    <div className={cx('header-navbar')}>
                        {/* LEFT */}
                        <div className={cx('navbar-left')}>
                            <ul className={cx('navbar-left-list')}>
                                {/* Logo */}
                                <li className={cx('navbar-left-item')}>
                                    <Link href="/" className={cx('nav__logo')}>
                                        <Image src="/img/main/logo1.png" alt="Phone Zone" width={70} height={40} />
                                    </Link>
                                </li>

                                {/* Danh mục + DropMenu */}
                                <li>
                                    <button
                                        type="button"
                                        className={cx('nav__menu')}
                                        onClick={handleToggleMenu}
                                        aria-expanded={isMenuOpen}
                                        aria-controls="category-menu"
                                    >
                                        <i className="fa-solid fa-bars" />
                                        <span>Danh mục</span>
                                    </button>

                                    {/* <DropMenu open={isMenuOpen} onClose={closeMenu} /> */}
                                </li>

                                {/* Search + suggest */}
                                <li className={cx('navbar-left-item')}>
                                    <div ref={searchWrapRef}>
                                        <form
                                            className={cx('nav-search-box')}
                                            onSubmit={(e) => {
                                                e.preventDefault();
                                                if (!keyword.trim()) return;

                                                setIsSearchOpen(false);
                                                setIsFocused(false);
                                                inputRef.current?.blur(); // ✅ quan trọng trên mobile
                                                router.push(`/search?q=${encodeURIComponent(keyword)}`); // ✅
                                            }}
                                        >
                                            <button type="submit">
                                                <i className="fa fa-search icon" />
                                            </button>

                                            <input
                                                ref={inputRef}
                                                type="text"
                                                placeholder="Bạn cần tìm gì?"
                                                value={keyword}
                                                onChange={(e) => setKeyword(e.target.value)}
                                                onFocus={() => {
                                                    setIsFocused(true);
                                                    setIsSearchOpen(true);
                                                }}
                                                className={cx('nav-search-input')}
                                            />

                                            {keyword && (
                                                <button
                                                    type="button"
                                                    className={cx('search-btn-close')}
                                                    onMouseDown={(e) => {
                                                        e.preventDefault();
                                                        setKeyword('');
                                                        setIsSearchOpen(false);
                                                    }}
                                                >
                                                    <i className="fa-solid fa-xmark" />
                                                </button>
                                            )}

                                            <SearchSuggest
                                                open={isSearchOpen && isFocused}
                                                keyword={debouncedKeyword}
                                                rawKeyword={keyword}
                                                onSelect={() => setIsSearchOpen(false)}
                                            />
                                        </form>
                                    </div>
                                </li>
                            </ul>
                        </div>

                        {/* RIGHT */}
                        <div className={cx('navbar-right')}>
                            <ul className={cx('nav-right-list')}>
                                <li className={cx('nav-right-item', 'nav__style-hover')}>
                                    <Link href="/hotline" className={cx('nav-right-item__icon')}>
                                        <i className="fa-regular fa-headphones" />
                                    </Link>
                                    <Link href="/hotline" className={cx('nav-right-item__link')}>
                                        Hotline 1900.5301
                                    </Link>
                                </li>

                                <li className={cx('nav-right-item', 'nav__style-hover')}>
                                    <Link href="/showroom" className={cx('nav-right-item__icon')}>
                                        <i className="fa-solid fa-location-dot" />
                                    </Link>
                                    <Link href="/showroom" className={cx('nav-right-item__link')}>
                                        Hệ thống Showroom
                                    </Link>
                                </li>

                                <li className={cx('nav-right-item', 'nav__style-hover')}>
                                    <Link href="/orders/lookup" className={cx('nav-right-item__icon')}>
                                        <i className="fa-regular fa-clipboard" />
                                    </Link>
                                    <Link href="/orders/lookup" className={cx('nav-right-item__link')}>
                                        Tra cứu đơn hàng
                                    </Link>
                                </li>

                                <li className={cx('nav-right-item', 'nav__style-hover')}>
                                    <Link href="/cart" className={cx('nav-right-item__icon')}>
                                        <span className={cx('cartIconWrap')}>
                                            <i className="fa-solid fa-cart-shopping" />
                                            {totalItems > 0 && <span className={cx('badge')}>{totalItems}</span>}
                                        </span>
                                    </Link>
                                    <Link href="/cart" className={cx('nav-right-item__link')}>
                                        Giỏ
                                        <br />
                                        hàng
                                    </Link>
                                </li>

                                {/* Đăng nhập + hover */}
                                <li className={cx('nav-right-item', 'nav__login-btn')}>
                                    <i className="fa-solid fa-circle-user" />

                                    {user ? (
                                        <>
                                            <span className={cx('nav-right-item__link')}>
                                                Xin chào
                                                <br />
                                                <b>{displayName}</b>
                                            </span>

                                            {/* Dropdown giống GearVN */}
                                            <div className={cx('user-dropdown')}>
                                                <Link href="/account">Tài khoản của tôi</Link>
                                                <Link href="/account?tab=orders">Đơn hàng</Link>
                                                <button
                                                    onClick={async () => {
                                                        await logoutUser();
                                                        window.location.href = '/';
                                                    }}
                                                >
                                                    Đăng xuất
                                                </button>
                                            </div>
                                        </>
                                    ) : (
                                        <>
                                            <Link href="/login" className={cx('nav-right-item__link')}>
                                                Đăng
                                                <br />
                                                nhập
                                            </Link>

                                            <LoginSuggest />
                                        </>
                                    )}
                                </li>
                            </ul>
                        </div>
                        {/* END RIGHT */}
                    </div>
                </div>
            </div>
            <DropMenu open={isMenuOpen} onClose={closeMenu} />
        </>
    );
}

export default Navbar;
