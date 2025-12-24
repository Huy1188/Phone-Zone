'use client';

import React, { useEffect, useState } from 'react';
import { getAllOrders } from '@/services/admin/orderService';
// Import file style SCSS module
import styles from '@/app/components/Admin/Orders/OrderManage.module.scss';
import Link from 'next/link';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchOrders = async (p = 1) => {
    setLoading(true);
    try {
      const res: any = await getAllOrders({ page: p, limit: 10 });
      if (res?.success) {
        setOrders(res?.data?.orders ?? res?.data ?? []);
      } else {
        alert(res?.message || 'Không thể tải danh sách đơn hàng');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders(page);
  }, [page]);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Quản lý Đơn hàng</h2>
        <Link href="/admin" className={styles.backBtn}>← Quay lại</Link>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className={styles.list}>
          {orders.map((o) => (
            <div key={o.order_id} className={styles.card}>
              <div><b>Mã đơn:</b> {o.order_id}</div>
              <div><b>Khách:</b> {o.user?.first_name} {o.user?.last_name} ({o.user?.email})</div>
              <div><b>Tổng:</b> {o.total_price}</div>
              <div><b>Trạng thái:</b> {o.status}</div>
              <div className={styles.actions}>
                <Link className={styles.smallBtn} href={`/admin/orders/edit/${o.order_id}`}>
                  Xem / cập nhật
                </Link>
              </div>
            </div>
          ))}
          {orders.length === 0 && <p>Chưa có đơn hàng.</p>}
        </div>
      )}

      <div className={styles.pagination}>
        <button className={styles.smallBtn} onClick={() => setPage((p) => Math.max(1, p - 1))}>
          ← Prev
        </button>
        <span>Page: {page}</span>
        <button className={styles.smallBtn} onClick={() => setPage((p) => p + 1)}>
          Next →
        </button>
      </div>
    </div>
  );
}
