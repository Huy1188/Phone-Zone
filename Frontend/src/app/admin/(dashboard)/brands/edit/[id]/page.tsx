'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getBrandById, updateBrand } from '@/services/admin/productService';
import styles from '@/app/components/Admin/Brands/EditBrand.module.scss';
import Link from 'next/link';

export default function EditBrand() {
    const router = useRouter();
    const params = useParams();
    const brandId = params?.id;

    const [name, setName] = useState('');
    const [origin, setOrigin] = useState('');
    const [previewLogo, setPreviewLogo] = useState('');
    const [file, setFile] = useState<File | null>(null);

    useEffect(() => {
        if (brandId) fetchDetail(Number(brandId));
    }, [brandId]);

    const fetchDetail = async (id: number) => {
        let res: any = await getBrandById(id);
        if (res?.success && res.data) {
            setName(res.data.name);
            setOrigin(res.data.origin || '');
            setPreviewLogo(res.data.logo_url);
        }
    };

    const handleSubmit = async () => {
        if (!name) return alert('Vui lòng nhập tên thương hiệu!');

        const formData = new FormData();
        formData.append('id', String(brandId));
        formData.append('name', name);
        formData.append('origin', origin);
        if (file) formData.append('image', file);

        try {
            let res: any = await updateBrand(formData);
            if (res?.success) {
                alert('Cập nhật thành công!');
                router.push('/admin/brands');
            } else {
                alert(res.message);
            }
        } catch (e) {
            alert('Lỗi hệ thống');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.cardBox} style={{ maxWidth: '600px', margin: '0 auto', borderTopColor: '#ffc107' }}>
                <h2 style={{ color: '#ffc107' }}>
                    <i className="fas fa-edit"></i> Sửa Thương Hiệu
                </h2>

                <div className={styles.formGroup}>
                    <label>Tên Thương Hiệu:</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
                </div>

                <div className={styles.formGroup}>
                    <label>Xuất xứ (Origin):</label>
                    <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} />
                </div>

                <div className={styles.formGroup}>
                    <label>Logo hiện tại:</label>
                    {previewLogo ? (
                        <img src={previewLogo} style={{ height: 80, objectFit: 'contain', border: '1px solid #ddd' }} />
                    ) : (
                        <span>Chưa có logo</span>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label>Chọn Logo mới (Nếu muốn thay đổi):</label>
                    <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Link href="/admin/brands" style={{ color: '#666', textDecoration: 'none' }}>
                        Quay lại
                    </Link>
                    <button
                        className={styles.btnSubmit}
                        style={{ width: 'auto', background: '#ffc107', color: '#333' }}
                        onClick={handleSubmit}
                    >
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
}
