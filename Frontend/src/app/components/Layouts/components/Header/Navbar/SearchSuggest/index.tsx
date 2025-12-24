'use client';

import { useEffect, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SearchSuggest.module.scss';
import Link from 'next/link';
import { fetchProducts } from '@/services/products';
import type { Product } from '@/types/product';

const cx = classNames.bind(styles);

interface Props {
    open: boolean;
    keyword: string; // debounced
    rawKeyword: string; // giá trị đang gõ
    onSelect?: () => void;
}

export default function SearchSuggest({ open, keyword, rawKeyword, onSelect }: Props) {
    const [items, setItems] = useState<Product[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!open || !rawKeyword.trim()) return;

        // debounce chưa xong
        if (!keyword.trim()) {
            setItems([]);
            return;
        }

        let cancelled = false;
        setLoading(true);

        (async () => {
            const res = await fetchProducts({ q: keyword.trim(), limit: 6, page: 1 });
            if (!cancelled) setItems(res);
        })()
            .catch(() => {
                if (!cancelled) setItems([]);
            })
            .finally(() => {
                if (!cancelled) setLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, [open, keyword, rawKeyword]);

    if (!open || !rawKeyword.trim()) return null;

    if (!keyword.trim() || loading) {
        return (
            <div className={cx('suggest')}>
                <div className={cx('loading')}>Đang tìm kiếm...</div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div className={cx('suggest')}>
                <div className={cx('empty')}>Không tìm thấy sản phẩm</div>
            </div>
        );
    }

    return (
        <div className={cx('suggest')}>
            {items.map((item) => (
                <Link
                    key={item.id}
                    href={`/product/${item.slug}`}
                    className={cx('item')}
                    onClick={() => {
                        onSelect?.(); // chỉ đóng suggest
                    }}
                >
                    {/* tuỳ Product type của bạn: image / images[0] */}
                    <img src={item.images?.[0] || '/placeholder.png'} alt={item.name} />
                    <span>{item.name}</span>
                </Link>
            ))}

            <Link
                href={`/search?q=${encodeURIComponent(rawKeyword)}`} // ✅ phương án 1
                className={cx('viewAll')}
                onClick={() => {
                    onSelect?.(); // chỉ đóng suggest
                }}
            >
                Xem tất cả kết quả →
            </Link>
        </div>
    );
}
