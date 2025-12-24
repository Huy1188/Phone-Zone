'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import styles from '@/app/components/Admin/Vouchers/EditVoucher.module.scss';
import { getVoucherById, updateVoucher } from '@/services/admin/voucherService';

export default function VoucherEditPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params?.id);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [form, setForm] = useState({
        code: '',
        discount_type: 'percent',
        discount_value: '',
        min_order_value: '',
        quantity: '',
        start_date: '',
        end_date: '',
    });

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res: any = await getVoucherById(id);
            if (!res?.success) {
                alert(res?.message || 'Không tìm thấy voucher');
                router.push('/admin/vouchers');
                return;
            }

            const v = res?.data?.voucher ?? res?.data ?? null;
            if (!v) {
                alert('Không tìm thấy voucher');
                router.push('/admin/vouchers');
                return;
            }

            // NOTE: input type="date" cần format YYYY-MM-DD
            const toDateInput = (d: any) => {
                if (!d) return '';
                const dt = new Date(d);
                if (Number.isNaN(dt.getTime())) return '';
                const yyyy = dt.getFullYear();
                const mm = String(dt.getMonth() + 1).padStart(2, '0');
                const dd = String(dt.getDate()).padStart(2, '0');
                return `${yyyy}-${mm}-${dd}`;
            };

            setForm({
                code: String(v.code ?? ''),
                discount_type: String(v.discount_type ?? 'percent'),
                discount_value: String(v.discount_value ?? ''),
                min_order_value: String(v.min_order_value ?? 0),
                quantity: String(v.quantity ?? ''),
                start_date: toDateInput(v.start_date),
                end_date: toDateInput(v.end_date),
            });
        } catch (e) {
            console.error(e);
            alert('Lỗi hệ thống');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload = {
            code: form.code.trim(),
            discount_type: form.discount_type,
            discount_value: Number(form.discount_value || 0),
            min_order_value: Number(form.min_order_value || 0),
            quantity: Number(form.quantity || 0),
            start_date: form.start_date,
            end_date: form.end_date,
        };

        if (!payload.code) return alert('Vui lòng nhập CODE');
        if (payload.discount_value <= 0) return alert('Giá trị giảm phải > 0');
        if (payload.quantity <= 0) return alert('Số lượng phải > 0');
        if (!payload.start_date || !payload.end_date) return alert('Vui lòng chọn ngày bắt đầu/kết thúc');

        setSaving(true);
        try {
            const res: any = await updateVoucher(id, payload);
            if (res?.success) {
                alert(res?.message || 'Cập nhật voucher thành công');
                router.push('/admin/vouchers');
            } else {
                alert(res?.message || 'Cập nhật thất bại');
            }
        } catch (e) {
            console.error(e);
            alert('Lỗi hệ thống');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.cardBox}>
                    <div className={styles.cardHeader}>
                        <h2>
                            <i className="fas fa-edit"></i> Sửa Voucher
                        </h2>
                    </div>
                    <div className={styles.loading}>Đang tải...</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.cardBox}>
                <div className={styles.cardHeader}>
                    <h2>
                        <i className="fas fa-edit"></i> Sửa Voucher #{id}
                    </h2>

                    <Link href="/admin/vouchers" className={styles.backBtn}>
                        <i className="fas fa-chevron-left"></i> Quay lại
                    </Link>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>Code *</label>
                            <input
                                value={form.code}
                                onChange={(e) => setForm((p) => ({ ...p, code: e.target.value }))}
                                placeholder="VD: NOEL2025"
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Loại giảm *</label>
                            <select
                                value={form.discount_type}
                                onChange={(e) => setForm((p) => ({ ...p, discount_type: e.target.value }))}
                            >
                                <option value="percent">Giảm %</option>
                                <option value="amount">Giảm tiền</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Giá trị giảm *</label>
                            <input
                                type="number"
                                min={1}
                                value={form.discount_value}
                                onChange={(e) => setForm((p) => ({ ...p, discount_value: e.target.value }))}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Đơn tối thiểu</label>
                            <input
                                type="number"
                                min={0}
                                value={form.min_order_value}
                                onChange={(e) => setForm((p) => ({ ...p, min_order_value: e.target.value }))}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Số lượng *</label>
                            <input
                                type="number"
                                min={1}
                                value={form.quantity}
                                onChange={(e) => setForm((p) => ({ ...p, quantity: e.target.value }))}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Ngày bắt đầu *</label>
                            <input
                                type="date"
                                value={form.start_date}
                                onChange={(e) => setForm((p) => ({ ...p, start_date: e.target.value }))}
                                required
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Ngày kết thúc *</label>
                            <input
                                type="date"
                                value={form.end_date}
                                onChange={(e) => setForm((p) => ({ ...p, end_date: e.target.value }))}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button className={styles.btnSubmit} type="submit" disabled={saving}>
                            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
