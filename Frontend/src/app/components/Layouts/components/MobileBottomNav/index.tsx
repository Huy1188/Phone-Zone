'use client';

import Link from 'next/link';
import classNames from 'classnames/bind';
import styles from './MobileBottomNav.module.scss';
import { useCategoryMenu } from '../CategoryMenuContext';
import { useCart } from '@/hooks/useCart';

const cx = classNames.bind(styles);

function MobileBottomNav() {
    const { openMenu } = useCategoryMenu();
    const { totalItems } = useCart();

    return (
        <nav className={cx('bottomNav')} aria-label="Điều hướng nhanh">
            <Link href="/" className={cx('item')}>
                <i className="fa-solid fa-house" />
                <span>Trang chủ</span>
            </Link>

            <button type="button" className={cx('item', 'btn')} onClick={openMenu} aria-label="Mở danh mục">
                <i className="fa-solid fa-bars" />
                <span>Danh mục</span>
            </button>

            <Link href="/cart" className={cx('item')}>
                <span className={cx('iconWrap')}>
                    <i className="fa-solid fa-cart-shopping" />
                    {totalItems > 0 && <span className={cx('badge')}>{totalItems}</span>}
                </span>
                <span>Giỏ hàng</span>
            </Link>

            <Link href="/news" className={cx('item')}>
                <i className="fa-regular fa-newspaper" />
                <span>Tin tức</span>
            </Link>

            <Link href="/account" className={cx('item')}>
                <i className="fa-solid fa-circle-user" />
                <span>Tài khoản</span>
            </Link>
        </nav>
    );
}

export default MobileBottomNav;
