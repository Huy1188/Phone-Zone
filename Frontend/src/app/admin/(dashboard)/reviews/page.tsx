'use client';

import React, { useEffect, useState } from 'react';
import styles from '@/app/components/Admin/Reviews/ReviewManage.module.scss';
import { deleteReview, getAllReviews } from '@/services/admin/reviewService';

export default function ReviewManagePage() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res: any = await getAllReviews();
      if (res?.success) setReviews(res?.data?.reviews ?? res?.data ?? []);
      else alert(res?.message || 'Không thể tải danh sách đánh giá');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleDelete = async (reviewId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa đánh giá này?')) return;
    const res: any = await deleteReview(reviewId);
    if (res?.success) {
      alert(res?.message || 'Xóa thành công');
      fetchReviews();
    } else {
      alert(res?.message || 'Xóa thất bại');
    }
  };

  return (
    <div className={styles.container}>
      <h2>Quản lý Review</h2>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className={styles.list}>
          {reviews.map((r) => (
            <div className={styles.cardBox} key={r.review_id}>
              <div><b>ID:</b> {r.review_id}</div>
              <div><b>User:</b> {r.user?.email}</div>
              <div><b>Product:</b> {r.product?.name}</div>
              <div><b>Rating:</b> {r.rating}</div>
              <div><b>Comment:</b> {r.comment}</div>
              <button className={styles.deleteBtn} onClick={() => handleDelete(r.review_id)}>
                Xóa
              </button>
            </div>
          ))}
          {reviews.length === 0 && <p>Chưa có review.</p>}
        </div>
      )}
    </div>
  );
}
