'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/app/components/Admin/Posts/EditPost.module.scss';
import { getPostById, getPostMeta, updatePost } from '@/services/admin/postService';

export default function EditPostPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params?.id);

    const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    const [post, setPost] = useState<any>(null);
    const [file, setFile] = useState<File | null>(null);

    const [form, setForm] = useState({
        title: '',
        content: '',
        post_category_id: '',
        product_id: '',
    });

    const fetchData = async () => {
        setLoading(true);
        try {
            const [resPost, resMeta]: any = await Promise.all([getPostById(id), getPostMeta()]);

            if (resMeta?.success) {
                const data = resMeta?.data ?? {};
                setCategories(data.categories ?? []);
                setProducts(data.products ?? []);
            } else {
                setCategories([]);
                setProducts([]);
            }

            if (resPost?.success) {
                const p = resPost?.data?.post ?? resPost?.data ?? null;
                setPost(p);

                setForm({
                    title: p?.title ?? '',
                    content: p?.content ?? '',
                    post_category_id: String(p?.post_category_id ?? ''),
                    product_id: p?.product_id ? String(p.product_id) : '',
                });
            } else {
                alert(resPost?.message || 'Không tìm thấy bài viết');
                router.push('/admin/posts');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchData();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title || !form.post_category_id) {
            alert('Vui lòng nhập Title và chọn Category');
            return;
        }

        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('content', form.content);
        fd.append('post_category_id', form.post_category_id);
        fd.append('product_id', form.product_id || '');
        if (file) fd.append('image', file);

        setSaving(true);
        try {
            const res: any = await updatePost(id, fd);
            if (res?.success) {
                alert(res?.message || 'Cập nhật thành công');
                fetchData();
            } else {
                alert(res?.message || 'Cập nhật thất bại');
            }
        } finally {
            setSaving(false);
        }
    };

    if (loading || !post) return <div className={styles.container}>Đang tải...</div>;

    const thumbUrl = post?.thumbnail ? `${BACKEND_URL}${post.thumbnail}` : '';

    return (
        <div className={styles.container}>
            <div className={styles.cardBox}>
                <div className={styles.cardHeader}>
                    <h2>
                        <i className="fas fa-edit"></i> Sửa bài viết #{id}
                    </h2>
                    <Link href="/admin/posts" className={styles.backBtn}>
                        ← Quay lại
                    </Link>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.grid}>
                        <div className={`${styles.formGroup} ${styles.full}`}>
                            <label>Tiêu đề *</label>
                            <input
                                value={form.title}
                                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Danh mục bài viết *</label>
                            <select
                                value={form.post_category_id}
                                onChange={(e) => setForm((p) => ({ ...p, post_category_id: e.target.value }))}
                            >
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map((c) => (
                                    <option key={c.post_category_id} value={c.post_category_id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Gắn sản phẩm (tuỳ chọn)</label>
                            <select
                                value={form.product_id}
                                onChange={(e) => setForm((p) => ({ ...p, product_id: e.target.value }))}
                            >
                                <option value="">-- Không chọn --</option>
                                {products.map((p) => (
                                    <option key={p.product_id} value={p.product_id}>
                                        {p.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={`${styles.formGroup} ${styles.full}`}>
                            <label>Nội dung</label>
                            <textarea
                                value={form.content}
                                onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
                            />
                        </div>

                        <div className={`${styles.formGroup} ${styles.full}`}>
                            <label>Thumbnail hiện tại</label>
                            {thumbUrl ? (
                                <img src={thumbUrl} className={styles.previewImg} alt="thumbnail" />
                            ) : (
                                <div className={styles.noImg}>Chưa có ảnh</div>
                            )}
                        </div>

                        <div className={`${styles.formGroup} ${styles.full}`}>
                            <label>Chọn ảnh mới (tuỳ chọn)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
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
