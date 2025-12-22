'use client';

import classNames from 'classnames/bind';
import styles from './CartItem.module.scss';
import { formatPrice } from '@/lib/formatPrice';
import { useCart } from '@/hooks/useCart';
import { SessionCartItem } from '@/types/backend';
import { resolveImageUrl } from '@/lib/resolveImageUrl';

const cx = classNames.bind(styles);

interface Props {
    item: SessionCartItem;
}

export default function CartItem({ item }: Props) {
    const { updateQuantity, removeItem } = useCart();
    console.log("item", item)
    const img = item.image ?? ''; // null -> ""
    const srcImg =
        img && img.startsWith('http')
            ? img
            : img
            ? `${process.env.NEXT_PUBLIC_STATIC_BASE}/${img}`
            : '/images/no-image.png'; // fallback

    return (
        <div className={cx('item')}>
            <div className={cx('left')}>
                <img className={cx('thumb')} src={resolveImageUrl(item.image)} alt={item.name} />

                <div className={cx('info')}>
                    <h3 className={cx('name')}>{item.name}</h3>

                    <div className={cx('controls')}>
                        <button
                            onClick={() => updateQuantity(item.variantId, item.quantity - 1)}
                            disabled={item.quantity <= 1}
                        >
                            −
                        </button>

                        <span>{item.quantity}</span>

                        <button onClick={() => updateQuantity(item.variantId, item.quantity + 1)}>+</button>
                    </div>
                </div>
            </div>

            <div className={cx('right')}>
                <strong>{formatPrice(item.price * item.quantity)}</strong>

                <button className={cx('remove')} onClick={() => removeItem(item.variantId)}>
                    Xóa
                </button>
            </div>
        </div>
    );
}
