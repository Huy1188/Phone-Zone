'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/app/components/Admin/Posts/CreatePost.module.scss';
import { createPost, getPostMeta } from '@/services/admin/postService';

export default function CreatePostPage() {
    const [loading, setLoading] = useState(false);

    const [categories, setCategories] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    const [form, setForm] = useState({
        title: '',
        content: '',
        product_id: '',
    });

    const [file, setFile] = useState<File | null>(null);

    const fetchMeta = async () => {
        const res: any = await getPostMeta();
        if (res?.success) {
            // backend bạn đang trả categories + products trong data
            const data = res?.data ?? {};
            setCategories(data.categories ?? []);
            setProducts(data.products ?? []);
        } else {
            setCategories([]);
            setProducts([]);
        }
    };

    useEffect(() => {
        fetchMeta();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.title) {
            alert('Vui lòng nhập Title và chọn Category');
            return;
        }

        const fd = new FormData();
        fd.append('title', form.title);
        fd.append('content', form.content);
        if (form.product_id) fd.append('product_id', form.product_id);
        if (file) fd.append('image', file); // ✅ field name phải là "image" vì multer upload.single("image")

        setLoading(true);
        try {
            const res: any = await createPost(fd);
            if (res?.success) {
                alert(res?.message || 'Tạo bài viết thành công');
                setForm({ title: '', content: '', product_id: '' });
                setFile(null);
            } else {
                alert(res?.message || 'Tạo bài viết thất bại');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.cardBox}>
                <div className={styles.cardHeader}>
                    <h2>
                        <i className="fas fa-plus-circle"></i> Tạo bài viết
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
                                placeholder="Nhập tiêu đề..."
                            />
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
                                placeholder="Nhập nội dung..."
                            />
                        </div>

                        <div className={`${styles.formGroup} ${styles.full}`}>
                            <label>Thumbnail (tuỳ chọn)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            />
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button className={styles.btnSubmit} type="submit" disabled={loading}>
                            {loading ? 'Đang lưu...' : 'Tạo bài viết'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
