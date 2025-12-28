'use client';

import classNames from 'classnames/bind';
import styles from './PriceBox.module.scss';
import { formatPrice } from '@/lib/formatPrice';
import { useCart } from '@/hooks/useCart';
import type { Product, ProductVariant } from '@/types/product';

const cx = classNames.bind(styles);

interface Props {
    product: Product;
    selectedVariant?: ProductVariant | null;
}

function normalizePromotions(promotions?: string | null): string[] {
    if (!promotions) return [];

    // Hỗ trợ: xuống dòng \n, \r\n, hoặc gạch đầu dòng "- ", "• "
    return promotions
        .split(/\r?\n/) // tách theo dòng
        .map((line) => line.trim())
        .map((line) => line.replace(/^[-•*]\s+/, '')) // bỏ bullet nếu có
        .filter(Boolean);
}

export default function PriceBox({ product, selectedVariant }: Props) {
    const { addItemByVariant } = useCart();
    const currentPrice = selectedVariant?.price ?? product.price;
    const variantId = selectedVariant?.variant_id;

    const { originalPrice, promotions } = product;

    const discountRate =
        originalPrice && originalPrice > 0 ? Math.round(((originalPrice - currentPrice) / originalPrice) * 100) : 0;
    const promoList = normalizePromotions(promotions);

    const handleBuyNow = async () => {
        if (!variantId) return alert('Sản phẩm chưa có variant để thêm giỏ.');
        if (product.variants?.length && !variantId) {
            return alert('Cấu hình bạn chọn không có sẵn. Vui lòng chọn lại.');
        }
        await addItemByVariant(variantId, 1);
    };

    return (
        <div className={cx('price-box')}>
            <div className={cx('prices')}>
                <span className={cx('current-price')}>{formatPrice(currentPrice)}</span>

                {originalPrice && originalPrice > currentPrice && (
                    <>
                        <del className={cx('old-price')}>{formatPrice(originalPrice)}</del>
                        <span className={cx('discount-badge')}>-{discountRate}%</span>
                    </>
                )}
            </div>

            {promoList.length > 0 && (
                <div className={cx('promotion-box')}>
                    <div className={cx('promo-title')}>🎁 Quà tặng khuyến mãi</div>
                    <ul>
                        {promoList.map((item, index) => (
                            <li key={index}>{item}</li>
                        ))}
                    </ul>
                </div>
            )}

            <div className={cx('actions')}>
                <button className={cx('btn', 'buy-now')} type="button" onClick={handleBuyNow}>
                    <strong>MUA NGAY</strong>
                    <span>(Giao tận nơi hoặc nhận tại cửa hàng)</span>
                </button>

                <button className={cx('btn', 'installment')} type="button">
                    <strong>TRẢ GÓP</strong>
                    <span>(Thủ tục đơn giản)</span>
                </button>
            </div>
        </div>
    );
}
