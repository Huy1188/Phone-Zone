'use client';

import { useMemo, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './CheckoutForm.module.scss';
import type { PaymentMethod, ShippingAddress } from '@/types/order';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import { createOrder } from '@/services/order';
import { getDefaultAddress } from '@/services/address';
import { useAuth } from '@/hooks/useAuth';
import AddressPickerModal from '../AddressPickerModal';
import type { Address } from '@/services/address';

const cx = classNames.bind(styles);

export default function CheckoutForm() {
    const router = useRouter();
    const { user, hydrated } = useAuth();
    const [addrModalOpen, setAddrModalOpen] = useState(false);
    const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);

    useEffect(() => {
        if (!hydrated) return;
        if (!user) return;

        (async () => {
            try {
                const res = await getDefaultAddress();
                const a = res.address;
                if (!a) return;

                // ✅ chỉ gợi ý address mặc định (preview), không fill cứng input
                setSelectedAddress(a);
            } catch {}
        })();
    }, [hydrated, user]);

    const onSelectAddress = (a: Address) => {
        setSelectedAddress(a);

        // ✅ fill vào form checkout
        setShipping((prev: any) => ({
            ...prev,
            fullName: a.recipient_name || prev.fullName,
            phone: a.recipient_phone || prev.phone,
            address: a.street || prev.address,
            city: a.city || prev.city,
            email: user?.email || prev.email,
        }));

        setAddrModalOpen(false);
    };

    const { items, totalMoney, refresh } = useCart();

    const [shipping, setShipping] = useState<ShippingAddress>({
        fullName: '',
        phone: '',
        email: '',
        address: '',
        city: '',
        note: '',
    });

    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('cod');
    const [submitting, setSubmitting] = useState(false);

    // demo: phí ship cố định, sau có thể tính theo địa chỉ
    const shippingFee = useMemo(() => (totalMoney > 5000000 ? 0 : 30000), [totalMoney]);
    const total = useMemo(() => totalMoney + shippingFee, [totalMoney, shippingFee]);

    const onSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!shipping.fullName || !shipping.phone || !shipping.address || !shipping.city) {
            alert('Vui lòng nhập đầy đủ Họ tên / SĐT / Địa chỉ / Tỉnh - TP.');
            return;
        }

        if (user && !selectedAddress) {
            alert('Vui lòng chọn địa chỉ giao hàng.');
            return;
        }

        setSubmitting(true);
        try {
            const res = await createOrder({
                payment_method: paymentMethod,
                name: shipping.fullName,
                phone: shipping.phone,
                address: shipping.address,
                city: shipping.city,
                note: shipping.note,
            });

            if (!res?.success) {
                throw new Error('Đặt hàng thất bại');
            }

            await refresh(); // ✅ quan trọng: đồng bộ lại badge navbar
            router.push(`/order-success?order_id=${res.order_id}`);
        } catch (err: any) {
            alert(err?.message || 'Lỗi đặt hàng');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form className={cx('form')} onSubmit={onSubmit}>
            <h2>Thông tin nhận hàng</h2>
            {user && (
                <div className={cx('addrTop')}>
                    <div className={cx('addrPreview')}>
                        <div className={cx('addrPreviewTitle')}>Địa chỉ giao hàng</div>

                        {selectedAddress ? (
                            <div className={cx('addrPreviewText')}>
                                <b>{selectedAddress.recipient_name}</b> — {selectedAddress.recipient_phone}
                                <br />
                                {selectedAddress.street}, {selectedAddress.city}
                                {selectedAddress.is_default ? (
                                    <span className={cx('addrDefaultTag')}>Mặc định</span>
                                ) : null}
                            </div>
                        ) : (
                            <div className={cx('addrPreviewText')}>Bạn chưa chọn địa chỉ.</div>
                        )}
                    </div>

                    <button type="button" className={cx('btnPickAddr')} onClick={() => setAddrModalOpen(true)}>
                        Chọn địa chỉ
                    </button>
                </div>
            )}

            <div className={cx('grid')}>
                <div className={cx('field')}>
                    <label>Họ và tên *</label>
                    <input
                        value={shipping.fullName}
                        onChange={(e) => setShipping((p) => ({ ...p, fullName: e.target.value }))}
                        placeholder="Nguyễn Văn A"
                    />
                </div>

                <div className={cx('field')}>
                    <label>Số điện thoại *</label>
                    <input
                        value={shipping.phone}
                        onChange={(e) => setShipping((p) => ({ ...p, phone: e.target.value }))}
                        placeholder="09xxxxxxx"
                    />
                </div>

                <div className={cx('field')}>
                    <label>Email</label>
                    <input
                        value={shipping.email}
                        onChange={(e) => setShipping((p) => ({ ...p, email: e.target.value }))}
                        placeholder="email@example.com"
                    />
                </div>

                <div className={cx('field', 'full')}>
                    <label>Địa chỉ *</label>
                    <input
                        value={shipping.address}
                        onChange={(e) => setShipping((p) => ({ ...p, address: e.target.value }))}
                        placeholder="Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành"
                    />
                </div>
                <div className={cx('field', 'full')}>
                    <label>Tỉnh/Thành phố *</label>
                    <input
                        value={shipping.city}
                        onChange={(e) => setShipping((p) => ({ ...p, city: e.target.value }))}
                        placeholder="TP.HCM / Hà Nội..."
                    />
                </div>
                <div className={cx('field', 'full')}>
                    <label>Ghi chú</label>
                    <textarea
                        value={shipping.note}
                        onChange={(e) => setShipping((p) => ({ ...p, note: e.target.value }))}
                        placeholder="Thời gian nhận hàng, ghi chú cho shipper..."
                    />
                </div>
            </div>

            <h2>Phương thức thanh toán</h2>

            <div className={cx('payments')}>
                <label className={cx('radio')}>
                    <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                    />
                    <span>Thanh toán khi nhận hàng (COD)</span>
                </label>

                <label className={cx('radio')}>
                    <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'bank'}
                        onChange={() => setPaymentMethod('bank')}
                    />
                    <span>Chuyển khoản ngân hàng</span>
                </label>

                <label className={cx('radio')}>
                    <input
                        type="radio"
                        name="payment"
                        checked={paymentMethod === 'momo'}
                        onChange={() => setPaymentMethod('momo')}
                    />
                    <span>Ví MoMo</span>
                </label>
            </div>

            <button className={cx('submit')} type="submit" disabled={submitting || items.length === 0}>
                {submitting ? 'Đang xử lý...' : 'Đặt hàng'}
            </button>

            <p className={cx('hint')}>
                (Demo) Tổng tiền = {total.toLocaleString('vi-VN')} đ, phí ship = {shippingFee.toLocaleString('vi-VN')} đ
            </p>

            <AddressPickerModal
                open={addrModalOpen}
                onClose={() => setAddrModalOpen(false)}
                onSelect={onSelectAddress}
                selectedId={selectedAddress?.address_id ?? null}
            />
        </form>
    );
}
