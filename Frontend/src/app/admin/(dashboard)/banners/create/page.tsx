'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import styles from '@/app/components/Admin/Banners/CreateBanner.module.scss';
import { createBanner } from '@/services/admin/bannerService';
import { useRouter } from 'next/navigation';

export default function CreateBannerPage() {
    const router = useRouter();

    const [isLoading, setIsLoading] = useState(false);
    const [form, setForm] = useState({
        title: '',
        link: '',
        is_active: '1',
    });
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!file) return alert('Vui lòng chọn ảnh banner');

        setIsLoading(true);
        try {
            const fd = new FormData();
            fd.append('title', form.title);
            fd.append('link', form.link);
            fd.append('is_active', form.is_active);
            fd.append('image', file);

            const res: any = await createBanner(fd);
            if (res?.success) {
                alert(res?.message || 'Tạo banner thành công');
                router.push('/admin/banners');
            } else {
                alert(res?.message || 'Tạo banner thất bại');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.cardBox}>
                <div className={styles.header}>
                    <h2>
                        <i className="fas fa-plus-circle"></i> Thêm banner
                    </h2>
                    <Link href="/admin/banners" className={styles.backBtn}>
                        ← Quay lại
                    </Link>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>Tiêu đề</label>
                            <input
                                value={form.title}
                                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                                placeholder="Nhập tiêu đề..."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Link (tuỳ chọn)</label>
                            <input
                                value={form.link}
                                onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
                                placeholder="https://..."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Trạng thái</label>
                            <select
                                value={form.is_active}
                                onChange={(e) => setForm((p) => ({ ...p, is_active: e.target.value }))}
                            >
                                <option value="1">Đang hiển thị</option>
                                <option value="0">Tạm ẩn</option>
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Ảnh banner *</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                                required
                            />
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button className={styles.btnPrimary} disabled={isLoading}>
                            {isLoading ? 'Đang tạo...' : 'Tạo banner'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
