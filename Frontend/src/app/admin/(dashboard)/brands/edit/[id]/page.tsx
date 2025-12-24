'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getBrandById, updateBrand } from '@/services/admin/brandService';
import styles from '@/app/components/Admin/Brands/EditBrand.module.scss';
import Link from 'next/link';

export default function EditBrand() {
    const router = useRouter();
    const params = useParams();
    const brandId = params?.id; // string | string[] | undefined

    const [name, setName] = useState('');
    const [origin, setOrigin] = useState('');
    const [previewLogo, setPreviewLogo] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (brandId) fetchDetail(Number(brandId));
    }, [brandId]);

    const fetchDetail = async (id: number) => {
        try {
            setLoading(true);
            const res: any = await getBrandById(id);

            // ✅ axiosClient đã return response.data
            // Backend của bạn thường: ok(res, { brand }, "...")
            const brand = res?.data?.brand ?? res?.data ?? null;

            if (res?.success && brand) {
                setName(brand?.name ?? '');
                setOrigin(brand?.origin ?? '');
                setPreviewLogo(brand?.logo_url ?? '');
            } else {
                alert(res?.message || 'Không tìm thấy thương hiệu');
                router.push('/admin/brands');
            }
        } catch (e) {
            console.error(e);
            alert('Lỗi tải dữ liệu thương hiệu');
        } finally {
            setLoading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] ?? null;
        setFile(f);

        // preview local file
        if (f) {
            const url = URL.createObjectURL(f);
            setPreviewLogo(url);
        }
    };

    const handleSubmit = async () => {
        if (!brandId) return;
        if (!name.trim()) return alert('Vui lòng nhập tên thương hiệu!');

        const formData = new FormData();
        formData.append('name', name.trim());
        formData.append('origin', origin.trim());
        if (file) formData.append('image', file); // ✅ đúng key upload.single("image")

        try {
            setLoading(true);

            // ✅ truyền đúng id
            const res: any = await updateBrand(String(brandId), formData);

            if (res?.success) {
                alert(res?.message || 'Cập nhật thành công!');
                router.push('/admin/brands');
            } else {
                alert(res?.message || 'Cập nhật thất bại');
            }
        } catch (e) {
            console.error(e);
            alert('Lỗi hệ thống');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.cardBox}>
                <div className={styles.cardHeader}>
                    <h2 className={styles.title}>
                        <i className="fas fa-edit"></i> Sửa Thương Hiệu
                    </h2>
                </div>

                <div className={styles.formGroup}>
                    <label>Tên Thương Hiệu</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập tên thương hiệu..."
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Xuất xứ</label>
                    <input
                        type="text"
                        value={origin}
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="Ví dụ: USA, Korea..."
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Logo hiện tại</label>
                    {previewLogo ? (
                        <div className={styles.previewWrap}>
                            <img src={previewLogo} className={styles.previewImage} alt="Brand logo preview" />
                        </div>
                    ) : (
                        <p className={styles.muted}>Chưa có logo</p>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label>Chọn logo mới (nếu muốn thay đổi)</label>
                    <div className={styles.fileBox}>
                        <input type="file" onChange={handleFileChange} />
                    </div>
                </div>

                <div className={styles.footer}>
                    <Link href="/admin/brands" className={styles.backLink}>
                        <i className="fas fa-chevron-left"></i> Quay lại
                    </Link>
                    <button className={styles.btnSubmit} onClick={handleSubmit} disabled={loading}>
                        {loading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i> Đang lưu...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save"></i> Lưu thay đổi
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
