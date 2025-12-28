'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import styles from '@/app/components/Admin/Orders/OrderManage.module.scss';
import { getAllOrders } from '@/services/admin/orderService';

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [page, setPage] = useState(1);
    const limit = 10;

    // Nếu backend có trả paging.totalPages thì dùng, còn không thì dùng “hasNext” theo length
    const [totalPages, setTotalPages] = useState<number | null>(null);

    const fetchOrders = async (p = 1) => {
        setLoading(true);
        try {
            const res: any = await getAllOrders({ page: p, limit });

            if (res?.success) {
                const data = res?.data ?? {};
                const items = data?.orders ?? data ?? [];

                setOrders(Array.isArray(items) ? items : []);

                // backend bạn có trả paging không? (trong code adminController Product có paging)
                const tp = data?.paging?.totalPages;
                setTotalPages(typeof tp === 'number' ? tp : null);
            } else {
                alert(res?.message || 'Không thể tải danh sách đơn hàng');
            }
        } catch (e) {
            console.error(e);
            alert('Lỗi hệ thống');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(page);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    const canPrev = page > 1;
    const canNext = useMemo(() => {
        if (totalPages !== null) return page < totalPages;
        // fallback nếu backend không có totalPages: nếu danh sách = limit => đoán còn trang tiếp
        return orders.length === limit;
    }, [orders.length, page, totalPages]);

    const formatMoney = (v: any) => {
        const n = Number(v ?? 0);
        if (Number.isNaN(n)) return String(v ?? '0');
        return n.toLocaleString('vi-VN');
    };

    const formatDate = (iso: any) => {
        if (!iso) return '---';
        try {
            return new Date(iso).toLocaleString('vi-VN');
        } catch {
            return String(iso);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.cardBox}>
                <div className={styles.cardHeader}>
                    <h2>
                        <i className="fas fa-receipt"></i> Quản lý Đơn hàng
                    </h2>

                    <Link href="/admin/dashboard" className={styles.backBtn}>
                        <i className="fas fa-chevron-left"></i> Quay lại
                    </Link>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: 90 }}>Mã đơn</th>
                                <th>Khách hàng</th>
                                <th style={{ width: 140 }}>Tổng tiền</th>
                                <th style={{ width: 130 }}>Trạng thái</th>
                                <th style={{ width: 170 }}>Ngày tạo</th>
                                <th style={{ width: 160, textAlign: 'center' }}>Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: 18 }}>
                                        Đang tải...
                                    </td>
                                </tr>
                            ) : orders.length > 0 ? (
                                orders.map((o) => (
                                    <tr key={o.order_id}>
                                        <td>
                                            <b>#{o.order_id}</b>
                                        </td>

                                        <td>
                                            <div className={styles.customer}>
                                                <div className={styles.customerName}>
                                                    {o.user?.first_name} {o.user?.last_name}
                                                </div>
                                                <div className={styles.customerEmail}>{o.user?.email || '---'}</div>
                                            </div>
                                        </td>

                                        <td className={styles.money}>
                                            {formatMoney(o.total_money ?? o.total_price)} ₫
                                        </td>

                                        <td>
                                            <span
                                                className={`${styles.badge} ${styles['st_' + (o.status || 'pending')]}`}
                                            >
                                                {o.status || 'pending'}
                                            </span>
                                        </td>

                                        <td className={styles.date}>{formatDate(o.createdAt)}</td>

                                        <td style={{ textAlign: 'center' }}>
                                            <Link
                                                className={styles.actionBtn}
                                                href={`/admin/orders/edit/${o.order_id}`}
                                            >
                                                <i className="fas fa-edit"></i> Xem / cập nhật
                                            </Link>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: 18 }}>
                                        Chưa có đơn hàng.
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
