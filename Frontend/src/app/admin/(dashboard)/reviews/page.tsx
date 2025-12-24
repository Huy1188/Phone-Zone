'use client';

import { useEffect, useState } from 'react';
import { getAllReviews, deleteReview } from '@/services/admin/reviewService';
import styles from '@/app/components/Admin/Reviews/ReviewManage.module.scss';

type ReviewItem = {
    review_id: number;
    rating: number;
    comment: string;
    createdAt: string;
    user_id?: number;
    user?: { first_name?: string; last_name?: string; email?: string };
    product?: { name?: string };
};

export default function ReviewManage() {
    const [reviews, setReviews] = useState<ReviewItem[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        fetchReviews();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const fetchReviews = async () => {
        setLoading(true);
        try {
            const res: any = await getAllReviews();

            // Backend của bạn đang trả dạng: { success, message, data: { reviews: [] } }
            if (res?.success) {
                setReviews(res?.data?.reviews ?? []);
            } else {
                setReviews([]);
                alert(res?.message || 'Không thể tải danh sách đánh giá');
            }
        } catch (e) {
            console.error(e);
            setReviews([]);
            alert('Lỗi server khi tải danh sách đánh giá');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc muốn xóa đánh giá này? Hành động không thể hoàn tác.')) return;

        try {
            const res: any = await deleteReview(id);
            if (res?.success) {
                alert(res?.message || 'Đã xóa thành công!');
                fetchReviews();
            } else {
                alert(res?.message || 'Xóa thất bại');
            }
        } catch (e) {
            console.error(e);
            alert('Lỗi server khi xóa đánh giá');
        }
    };

    const renderStars = (rating: number) => {
        const safe = Math.max(0, Math.min(5, Number(rating || 0)));
        return (
            <div className={styles.stars} aria-label={`Rating ${safe}/5`}>
                {Array.from({ length: 5 }).map((_, i) => {
                    const filled = i + 1 <= safe;
                    return <i key={i} className={`fas fa-star ${filled ? styles.starFilled : styles.starEmpty}`} />;
                })}
            </div>
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.cardBox}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.title}>
                        <i className="fas fa-star" /> Quản lý Đánh giá sản phẩm
                    </h2>
                </div>

                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: 90 }}>ID</th>
                                <th style={{ width: 260 }}>Khách hàng</th>
                                <th>Sản phẩm</th>
                                <th style={{ width: 140 }}>Đánh giá</th>
                                <th>Nội dung bình luận</th>
                                <th style={{ width: 140 }}>Ngày gửi</th>
                                <th style={{ width: 110, textAlign: 'center' }}>Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={7} className={styles.centerRow}>
                                        Đang tải...
                                    </td>
                                </tr>
                            ) : reviews.length > 0 ? (
                                reviews.map((item) => (
                                    <tr key={item.review_id}>
                                        <td className={styles.mono}>#{item.review_id}</td>

                                        <td>
                                            <div className={styles.customerName}>
                                                {(item.user?.first_name || '') + ' ' + (item.user?.last_name || '')}
                                            </div>
                                            <div className={styles.subText}>
                                                {item.user?.email ? item.user.email : `ID: ${item.user_id ?? '--'}`}
                                            </div>
                                        </td>

                                        <td>
                                            <div className={styles.productName} title={item.product?.name || ''}>
                                                {item.product?.name || '—'}
                                            </div>
                                        </td>

                                        <td>{renderStars(item.rating)}</td>

                                        <td>
                                            <div className={styles.comment} title={item.comment}>
                                                {item.comment || '—'}
                                            </div>
                                        </td>

                                        <td className={styles.subText}>
                                            {item.createdAt
                                                ? new Date(item.createdAt).toLocaleDateString('vi-VN')
                                                : '—'}
                                        </td>

                                        <td className={styles.actionCol}>
                                            <button
                                                className={styles.btnDelete}
                                                onClick={() => handleDelete(item.review_id)}
                                                title="Xóa review"
                                            >
                                                <i className="fas fa-trash" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className={styles.emptyRow}>
                                        Chưa có đánh giá nào
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
