'use client';

import React, { useEffect, useState } from 'react';
import { createVoucher, deleteVoucher, getAllVouchers, updateVoucher } from '@/services/admin/voucherService';
import styles from '@/app/components/Admin/Vouchers/VoucherManage.module.css';

export default function VoucherManagePage() {
  const [vouchers, setVouchers] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const res: any = await getAllVouchers();
      if (res?.success) setVouchers(res?.data?.vouchers ?? res?.data ?? []);
      else alert(res?.message || 'Không thể tải voucher');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVouchers();
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const payload = {
      code: String(fd.get('code') || ''),
      discount_type: String(fd.get('discount_type') || ''),
      discount_value: Number(fd.get('discount_value') || 0),
      min_order_value: Number(fd.get('min_order_value') || 0),
      quantity: Number(fd.get('quantity') || 0),
      start_date: String(fd.get('start_date') || ''),
      end_date: String(fd.get('end_date') || ''),
    };

    const res: any = await createVoucher(payload);
    if (res?.success) {
      alert(res?.message || 'Tạo voucher thành công');
      e.currentTarget.reset();
      fetchVouchers();
    } else {
      alert(res?.message || 'Tạo voucher thất bại');
    }
  };

  const handleDelete = async (voucherId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa voucher này?')) return;
    const res: any = await deleteVoucher(voucherId);
    if (res?.success) {
      alert(res?.message || 'Xóa voucher thành công');
      fetchVouchers();
    } else {
      alert(res?.message || 'Xóa voucher thất bại');
    }
  };

  const handleToggle = async (v: any) => {
    const res: any = await updateVoucher(v.voucher_id, {
      ...v,
      code: v.code,
    });

    if (res?.success) fetchVouchers();
    else alert(res?.message || 'Cập nhật voucher thất bại');
  };

  return (
    <div className={styles.container}>
      <h2>Quản lý Voucher</h2>

      <form className={styles.form} onSubmit={handleCreate}>
        <input name="code" placeholder="CODE" className={styles.input} required />
        <select name="discount_type" className={styles.select} defaultValue="percent">
          <option value="percent">%</option>
          <option value="amount">Giảm tiền</option>
        </select>
        <input name="discount_value" placeholder="Giá trị giảm" className={styles.input} required />
        <input name="min_order_value" placeholder="Đơn tối thiểu" className={styles.input} />
        <input name="quantity" placeholder="Số lượng" className={styles.input} required />
        <input name="start_date" type="date" className={styles.input} required />
        <input name="end_date" type="date" className={styles.input} required />
        <button className={styles.btn} type="submit">Tạo</button>
      </form>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className={styles.list}>
          {vouchers.map((v) => (
            <div key={v.voucher_id} className={styles.card}>
              <div><b>Code:</b> {v.code}</div>
              <div><b>Type:</b> {v.discount_type}</div>
              <div><b>Value:</b> {v.discount_value}</div>
              <div><b>Qty:</b> {v.quantity}</div>

              <div className={styles.actions}>
                <button className={styles.smallBtn} onClick={() => handleToggle(v)}>Cập nhật</button>
                <button className={styles.deleteBtn} onClick={() => handleDelete(v.voucher_id)}>Xóa</button>
              </div>
            </div>
          ))}
          {vouchers.length === 0 && <p>Chưa có voucher.</p>}
        </div>
      )}
    </div>
  );
}
