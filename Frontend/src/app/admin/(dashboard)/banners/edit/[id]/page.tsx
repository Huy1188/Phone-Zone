'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/components/Admin/Banners/EditBanner.module.scss';
import { deleteBanner, getBannerById, updateBanner } from '@/services/admin/bannerService';
import { useParams, useRouter } from 'next/navigation';

export default function EditBannerPage() {
    const params = useParams();
    const router = useRouter();
    const id = Number(params?.id);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [banner, setBanner] = useState<any>(null);
    const [file, setFile] = useState<File | null>(null);

    const [form, setForm] = useState({
        title: '',
        link: '',
        is_active: '1',
    });

    const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res: any = await getBannerById(id);
            if (res?.success) {
                const b = res?.data?.banner ?? res?.data ?? null;
                setBanner(b);
                setForm({
                    title: b?.title ?? '',
                    link: b?.link ?? '',
                    is_active: b?.is_active ? '1' : '0',
                });
            } else {
                alert(res?.message || 'Không tìm thấy banner');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchDetail();
    }, [id]);

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSaving(true);
        try {
            const fd = new FormData();
            fd.append('title', form.title);
            fd.append('link', form.link);
            fd.append('is_active', form.is_active);
            if (file) fd.append('image', file);

            const res: any = await updateBanner(id, fd);
            if (res?.success) {
                alert(res?.message || 'Cập nhật thành công');
                fetchDetail();
                setFile(null);
            } else {
                alert(res?.message || 'Cập nhật thất bại');
            }
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Xóa banner này? Không thể hoàn tác.')) return;
        const res: any = await deleteBanner(id);
        if (res?.success) {
            alert(res?.message || 'Đã xóa');
            router.push('/admin/banners');
        } else {
            alert(res?.message || 'Xóa thất bại');
        }
    };

    if (loading) return <div className={styles.container}>Đang tải...</div>;
    if (!banner) return <div className={styles.container}>Banner không tồn tại</div>;

    return (
        <div className={styles.container}>
            <div className={styles.cardBox}>
                <div className={styles.header}>
                    <h2>
                        <i className="fas fa-edit"></i> Sửa banner #{id}
                    </h2>
                    <Link href="/admin/banners" className={styles.backBtn}>
                        ← Quay lại
                    </Link>
                </div>

                <form className={styles.form} onSubmit={handleUpdate}>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>Tiêu đề</label>
                            <input
                                value={form.title}
                                onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Link</label>
                            <input
                                value={form.link}
                                onChange={(e) => setForm((p) => ({ ...p, link: e.target.value }))}
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
                            <label>Đổi ảnh (tuỳ chọn)</label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                            />
                        </div>
                    </div>

                    <div className={styles.imageRow}>
                        <div className={styles.imageBox}>
                            <div className={styles.imageTitle}>Ảnh hiện tại</div>
                            {banner.image ? (
                                <Image
                                    src={`${BACKEND_URL}${banner.image}`}
                                    alt={banner.title || 'banner'}
                                    width={520}
                                    height={220}
                                    style={{ objectFit: 'cover' }}
                                />
                            ) : (
                                <div className={styles.noimg}>Chưa có ảnh</div>
                            )}
                        </div>

                        <div className={styles.imageBox}>
                            <div className={styles.imageTitle}>Ảnh mới</div>
                            {file ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img src={URL.createObjectURL(file)} alt="new" className={styles.newPreview} />
                            ) : (
                                <div className={styles.noimg}>Chưa chọn ảnh</div>
                            )}
                        </div>
                    </div>

                    <div className={styles.footerBetween}>
                        <button type="button" className={styles.btnDanger} onClick={handleDelete}>
                            <i className="fas fa-trash"></i> Xóa banner
                        </button>

                        <button className={styles.btnPrimary} disabled={saving}>
                            {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
