'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/app/components/Admin/Vouchers/VoucherManage.module.scss';
import { deleteVoucher, getAllVouchers } from '@/services/admin/voucherService';

export default function VoucherListPage() {
    const [vouchers, setVouchers] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const fetchVouchers = async () => {
        setLoading(true);
        try {
            const res: any = await getAllVouchers();
            if (res?.success) setVouchers(res?.data?.vouchers ?? res?.data ?? []);
            else alert(res?.message || 'Không thể tải voucher');
        } catch (e) {
            console.error(e);
            alert('Lỗi hệ thống');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchVouchers();
    }, []);

    const handleDelete = async (voucherId: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa voucher này?')) return;
        try {
            const res: any = await deleteVoucher(voucherId);
            if (res?.success) {
                alert(res?.message || 'Xóa voucher thành công');
                fetchVouchers();
            } else alert(res?.message || 'Xóa voucher thất bại');
        } catch (e) {
            console.error(e);
            alert('Lỗi hệ thống');
        }
    };

    const formatDate = (d: any) => {
        if (!d) return '---';
        try {
            return new Date(d).toLocaleDateString('vi-VN');
        } catch {
            return String(d);
        }
    };

    const typeLabel = (t: string) => (t === 'percent' ? '%' : 'Giảm tiền');

    return (
        <div className={styles.container}>
            <div className={styles.cardBox}>
                <div className={styles.cardHeader}>
                    <h2>
                        <i className="fas fa-ticket-alt"></i> Quản lý Voucher
                    </h2>

                    <div className={styles.headerActions}>
                        <Link href="/admin/dashboard" className={styles.backBtn}>
                            <i className="fas fa-chevron-left"></i> Quay lại
                        </Link>

                        <Link href="/admin/vouchers/create" className={styles.createBtn}>
                            <i className="fas fa-plus"></i> Tạo voucher
                        </Link>
                    </div>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: 70 }}>ID</th>
                                <th style={{ width: 120 }}>Code</th>
                                <th style={{ width: 120 }}>Loại</th>
                                <th style={{ width: 120 }}>Giá trị</th>
                                <th style={{ width: 120 }}>Tối thiểu</th>
                                <th style={{ width: 100 }}>Số lượng</th>
                                <th style={{ width: 130 }}>Bắt đầu</th>
                                <th style={{ width: 130 }}>Kết thúc</th>
                                <th style={{ width: 170, textAlign: 'center' }}>Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={9} style={{ textAlign: 'center', padding: 18 }}>
                                        Đang tải...
                                    </td>
                                </tr>
                            ) : vouchers.length > 0 ? (
                                vouchers.map((v) => (
                                    <tr key={v.voucher_id}>
                                        <td>#{v.voucher_id}</td>
                                        <td>
                                            <span className={styles.code}>{v.code}</span>
                                        </td>
                                        <td>
                                            <span className={styles.badge}>{typeLabel(v.discount_type)}</span>
                                        </td>
                                        <td className={styles.money}>{v.discount_value}</td>
                                        <td className={styles.money}>{v.min_order_value || 0}</td>
                                        <td>{v.quantity}</td>
                                        <td>{formatDate(v.start_date)}</td>
                                        <td>{formatDate(v.end_date)}</td>
                                        <td style={{ textAlign: 'center' }}>
                                            <div className={styles.actionGroup}>
                                                <Link
                                                    href={`/admin/vouchers/edit/${v.voucher_id}`}
                                                    className={`${styles.actionBtn} ${styles.edit}`}
                                                >
                                                    <i className="fas fa-edit"></i> Sửa
                                                </Link>

                                                <button
                                                    type="button"
                                                    className={`${styles.actionBtn} ${styles.delete}`}
                                                    onClick={() => handleDelete(v.voucher_id)}
                                                >
                                                    <i className="fas fa-trash"></i> Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={9} style={{ textAlign: 'center', padding: 18 }}>
                                        Chưa có voucher.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
