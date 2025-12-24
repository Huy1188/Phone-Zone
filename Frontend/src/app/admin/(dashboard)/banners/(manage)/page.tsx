'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/components/Admin/Banners/BannerManage.module.scss';
import { deleteBanner, getAllBanners, updateBanner } from '@/services/admin/bannerService';

export default function BannerListPage() {
    const [banners, setBanners] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

    const fetchBanners = async () => {
        setLoading(true);
        try {
            const res: any = await getAllBanners();
            if (res?.success) setBanners(res?.data?.banners ?? res?.data ?? []);
            else alert(res?.message || 'Không thể tải banner');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBanners();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc chắn muốn xóa banner này?')) return;
        const res: any = await deleteBanner(id);
        if (res?.success) {
            alert(res?.message || 'Xóa banner thành công');
            fetchBanners();
        } else {
            alert(res?.message || 'Xóa banner thất bại');
        }
    };

    const handleToggle = async (b: any) => {
        // backend thường yêu cầu gửi đủ field -> mình gửi title/link + is_active
        const fd = new FormData();
        fd.append('title', b?.title ?? '');
        fd.append('link', b?.link ?? '');
        fd.append('is_active', b?.is_active ? '0' : '1');

        const res: any = await updateBanner(b.banner_id, fd);
        if (res?.success) fetchBanners();
        else alert(res?.message || 'Cập nhật trạng thái thất bại');
    };

    return (
        <div className={styles.container}>
            <div className={styles.cardBox}>
                <div className={styles.header}>
                    <h2>
                        <i className="fas fa-images"></i> Quản lý Banner
                    </h2>

                    <div className={styles.headerActions}>
                        <Link href="/admin/banners/create" className={styles.btnPrimary}>
                            <i className="fas fa-plus"></i> Thêm banner
                        </Link>
                    </div>
                </div>

                <div className={styles.tableWrap}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: 70 }}>ID</th>
                                <th style={{ width: 220 }}>Ảnh</th>
                                <th>Tiêu đề</th>
                                <th>Link</th>
                                <th style={{ width: 120 }}>Trạng thái</th>
                                <th style={{ width: 240, textAlign: 'center' }}>Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className={styles.center}>
                                        Đang tải...
                                    </td>
                                </tr>
                            ) : banners.length > 0 ? (
                                banners.map((b) => (
                                    <tr key={b.banner_id}>
                                        <td>#{b.banner_id}</td>

                                        <td>
                                            <div className={styles.thumb}>
                                                {b.image ? (
                                                    <Image
                                                        src={`${BACKEND_URL}${b.image}`}
                                                        alt={b.title || 'banner'}
                                                        width={210}
                                                        height={95}
                                                        style={{ objectFit: 'cover' }}
                                                    />
                                                ) : (
                                                    <div className={styles.noimg}>No image</div>
                                                )}
                                            </div>
                                        </td>

                                        <td>
                                            <div className={styles.titleCell} title={b.title}>
                                                {b.title || '---'}
                                            </div>
                                        </td>

                                        <td>
                                            <div className={styles.linkCell} title={b.link}>
                                                {b.link || '---'}
                                            </div>
                                        </td>

                                        <td>
                                            <span
                                                className={`${styles.badge} ${
                                                    b.is_active ? styles.active : styles.inactive
                                                }`}
                                            >
                                                {b.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>

                                        <td className={styles.center}>
                                            <div className={styles.actions}>
                                                <button
                                                    type="button"
                                                    className={`${styles.actionBtn} ${styles.toggle}`}
                                                    onClick={() => handleToggle(b)}
                                                >
                                                    <i className="fas fa-eye"></i> {b.is_active ? 'Ẩn' : 'Hiện'}
                                                </button>

                                                <Link
                                                    href={`/admin/banners/edit/${b.banner_id}`}
                                                    className={`${styles.actionBtn} ${styles.edit}`}
                                                >
                                                    <i className="fas fa-edit"></i> Sửa
                                                </Link>

                                                <button
                                                    type="button"
                                                    className={`${styles.actionBtn} ${styles.delete}`}
                                                    onClick={() => handleDelete(b.banner_id)}
                                                >
                                                    <i className="fas fa-trash"></i> Xóa
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={6} className={styles.center}>
                                        Chưa có banner nào.
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
