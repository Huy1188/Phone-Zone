'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import classNames from 'classnames/bind';
import styles from './ReviewSection.module.scss';

import { fetchReviewSummary, fetchReviewsPaged, upsertMyReview, fetchCanReview } from '@/services/reviews';

const cx = classNames.bind(styles);

type Props = {
    productId: number;
};

export default function ReviewSection({ productId }: Props) {
    const { user, hydrated } = useAuth();

    useEffect(() => {
        if (hydrated && productId > 0) load();
    }, [hydrated, user?.user_id, productId]);

    const [avg, setAvg] = useState(0);
    const [count, setCount] = useState(0);
    const [reviews, setReviews] = useState<any[]>([]);
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [canReview, setCanReview] = useState<boolean>(false);
    const [reason, setReason] = useState<string | null>(null);

    const load = async () => {
        setError(null);

        // 1) Can review (cho phép fail riêng)
        try {
            const c = await fetchCanReview(productId);
            setCanReview(!!c.can);
            setReason(c.reason ?? null);
        } catch (e: any) {
            // fallback: nếu 401 thì coi như chưa login
            const msg = e instanceof Error ? e.message : String(e);
            if (msg.includes('401')) setReason('not_logged_in');
            else setReason(null);
            setCanReview(false);
        }

        // 2) Summary
        try {
            const s = await fetchReviewSummary(productId);
            setAvg(s.summary?.avg ?? 0);
            setCount(s.summary?.count ?? 0);
        } catch {
            setAvg(0);
            setCount(0);
        }

        // 3) List
        try {
            const r = await fetchReviewsPaged({ productId, page: 1, limit: 10 });
            setReviews(r.reviews ?? []);
        } catch {
            setReviews([]);
        }
    };
    useEffect(() => {
        if (productId > 0) load();
    }, [productId]);

    const submit = async () => {
        try {
            setError(null);
            await upsertMyReview({ productId, rating, comment });
            setComment('');
            await load();
        } catch (e: any) {
            let raw = e instanceof Error ? e.message : String(e?.message ?? e ?? '');
            try {
                const obj = JSON.parse(raw);
                if (obj?.message) raw = obj.message;
            } catch {}
            setError(raw || 'Không thể gửi đánh giá.');
        }
    };

    return (
        <div className={cx('reviewSection')}>
            <h2 className={cx('title')}>Đánh giá sản phẩm</h2>

            <div className={cx('summary')}>
                <div className={cx('avg')}>{avg.toFixed(1)}</div>
                <div className={cx('count')}>/5 • {count} đánh giá</div>
            </div>

            {error && <div className={cx('error')}>{error}</div>}

            {!canReview ? (
                <div className={cx('notice')}>
                    {reason === 'not_logged_in'
                        ? 'Vui lòng đăng nhập để đánh giá.'
                        : 'Bạn chỉ có thể đánh giá sau khi đơn hàng đã giao (delivered).'}
                </div>
            ) : (
                <div className={cx('form')}>
                    <div className={cx('formRow')}>
                        <label className={cx('label')}>Số sao</label>
                        <select
                            className={cx('select')}
                            value={rating}
                            onChange={(e) => setRating(Number(e.target.value))}
                        >
                            {[5, 4, 3, 2, 1].map((n) => (
                                <option key={n} value={n}>
                                    {n} sao
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={cx('formRow')}>
                        <label className={cx('label')}>Nhận xét</label>
                        <textarea
                            className={cx('textarea')}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm"
                        />
                    </div>

                    <button className={cx('submitBtn')} onClick={submit} disabled={!comment.trim()}>
                        Gửi đánh giá
                    </button>
                </div>
            )}

            <div className={cx('reviewList')}>
                {reviews.map((rv) => (
                    <div key={rv.review_id} className={cx('reviewItem')}>
                        <div className={cx('reviewHeader')}>
                            <span className={cx('username')}>{rv.user?.username ?? 'Ẩn danh'}</span>
                            <span className={cx('stars')}>
                                {'★'.repeat(rv.rating)}
                                {'☆'.repeat(5 - rv.rating)}
                            </span>
                        </div>
                        <div className={cx('comment')}>{rv.comment}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
