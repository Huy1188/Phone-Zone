'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/app/components/Admin/Vouchers/CreateVoucher.module.scss';
import { createVoucher } from '@/services/admin/voucherService';
import { useRouter } from 'next/navigation';

export default function VoucherCreatePage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);

    const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);

        const payload = {
            code: String(fd.get('code') || '').trim(),
            discount_type: String(fd.get('discount_type') || 'percent'),
            discount_value: Number(fd.get('discount_value') || 0),
            min_order_value: Number(fd.get('min_order_value') || 0),
            quantity: Number(fd.get('quantity') || 0),
            start_date: String(fd.get('start_date') || ''),
            end_date: String(fd.get('end_date') || ''),
        };

        if (!payload.code) return alert('Vui lòng nhập CODE');
        if (!payload.discount_value || payload.discount_value <= 0) return alert('Giá trị giảm phải > 0');
        if (!payload.quantity || payload.quantity <= 0) return alert('Số lượng phải > 0');

        setLoading(true);
        try {
            const res: any = await createVoucher(payload);
            if (res?.success) {
                alert(res?.message || 'Tạo voucher thành công');
                router.push('/admin/vouchers');
            } else {
                alert(res?.message || 'Tạo voucher thất bại');
            }
        } catch (e) {
            console.error(e);
            alert('Lỗi hệ thống');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.cardBox}>
                <div className={styles.cardHeader}>
                    <h2>
                        <i className="fas fa-plus-circle"></i> Tạo Voucher
                    </h2>

                    <Link href="/admin/vouchers" className={styles.backBtn}>
                        <i className="fas fa-chevron-left"></i> Quay lại
                    </Link>
                </div>

                <form className={styles.form} onSubmit={handleCreate}>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>Code *</label>
                            <input name="code" placeholder="VD: NOEL2025" required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Loại giảm *</label>
                            <select name="discount_type" defaultValue="percent">
                                <option value="percent">Giảm %</option>
                                <option value="amount">Giảm tiền</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Giá trị giảm *</label>
                            <input name="discount_value" type="number" min={1} placeholder="VD: 10" required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Đơn tối thiểu</label>
                            <input name="min_order_value" type="number" min={0} placeholder="VD: 500000" />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Số lượng *</label>
                            <input name="quantity" type="number" min={1} placeholder="VD: 50" required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Ngày bắt đầu *</label>
                            <input name="start_date" type="date" required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Ngày kết thúc *</label>
                            <input name="end_date" type="date" required />
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button className={styles.btnSubmit} type="submit" disabled={loading}>
                            {loading ? 'Đang tạo...' : 'Tạo voucher'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
