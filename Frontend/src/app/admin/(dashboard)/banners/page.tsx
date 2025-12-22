'use client';

import React, { useEffect, useState } from 'react';
import { createBanner, deleteBanner, getAllBanners, updateBanner } from '@/services/admin/bannerService';
import styles from '@/app/components/Admin/Banners/BannerManage.module.css';
import Link from 'next/link';
import Image from 'next/image';

export default function BannerManagePage() {
  const [banners, setBanners] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // URL backend để render ảnh (không kèm /api)
  const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

  const fetchBanners = async () => {
    setLoading(true);
    try {
      const res: any = await getAllBanners();
      if (res?.success) {
        setBanners(res?.data?.banners ?? res?.data ?? []);
      } else {
        alert(res?.message || 'Không thể tải banner');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  const handleCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const fd = new FormData(form);

    const res: any = await createBanner(fd);
    if (res?.success) {
      alert(res?.message || 'Tạo banner thành công');
      form.reset();
      fetchBanners();
    } else {
      alert(res?.message || 'Tạo banner thất bại');
    }
  };

  const handleUpdate = async (bannerId: number, payload: { title?: string; link?: string; is_active?: boolean; image?: File | null }) => {
    const fd = new FormData();
    if (payload.title !== undefined) fd.append('title', payload.title);
    if (payload.link !== undefined) fd.append('link', payload.link);
    if (payload.is_active !== undefined) fd.append('is_active', payload.is_active ? '1' : '0');
    if (payload.image) fd.append('image', payload.image);

    const res: any = await updateBanner(bannerId, fd);
    if (res?.success) {
      alert(res?.message || 'Cập nhật banner thành công');
      fetchBanners();
    } else {
      alert(res?.message || 'Cập nhật banner thất bại');
    }
  };

  const handleDelete = async (bannerId: number) => {
    if (!confirm('Bạn có chắc chắn muốn xóa banner này?')) return;
    const res: any = await deleteBanner(bannerId);
    if (res?.success) {
      alert(res?.message || 'Xóa banner thành công');
      fetchBanners();
    } else {
      alert(res?.message || 'Xóa banner thất bại');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Quản lý Banner</h2>
        <Link href="/admin" className={styles.backBtn}>← Quay lại</Link>
      </div>

      <form onSubmit={handleCreate} className={styles.form}>
        <input name="title" placeholder="Tiêu đề" className={styles.input} />
        <input name="link" placeholder="Link (tuỳ chọn)" className={styles.input} />
        <select name="is_active" className={styles.select} defaultValue="1">
          <option value="1">Đang hiển thị</option>
          <option value="0">Tạm ẩn</option>
        </select>
        <input name="image" type="file" accept="image/*" className={styles.input} required />
        <button type="submit" className={styles.btn}>Tạo banner</button>
      </form>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className={styles.list}>
          {banners.map((b) => (
            <div key={b.banner_id} className={styles.card}>
              <div className={styles.thumb}>
                {b.image ? (
                  <Image
                    src={`${BACKEND_URL}${b.image}`}
                    alt={b.title || 'banner'}
                    width={320}
                    height={140}
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className={styles.noimg}>No image</div>
                )}
              </div>

              <div className={styles.info}>
                <div><b>ID:</b> {b.banner_id}</div>
                <div><b>Title:</b> {b.title}</div>
                <div><b>Link:</b> {b.link || '-'}</div>
                <div><b>Status:</b> {b.is_active ? 'Active' : 'Inactive'}</div>
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.smallBtn}
                  onClick={() =>
                    handleUpdate(b.banner_id, {
                      is_active: !b.is_active,
                      title: b.title,
                      link: b.link,
                    })
                  }
                >
                  {b.is_active ? 'Ẩn' : 'Hiện'}
                </button>

                <button className={styles.deleteBtn} onClick={() => handleDelete(b.banner_id)}>
                  Xóa
                </button>
              </div>
            </div>
          ))}
          {banners.length === 0 && <p>Chưa có banner nào.</p>}
        </div>
      )}
    </div>
  );
}
