'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createBrand } from '@/services/admin/brandService';
import styles from '@/app/components/Admin/Brands/CreateBrand.module.scss';
import Link from 'next/link';

export default function CreateBrand() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [origin, setOrigin] = useState('');
    const [file, setFile] = useState<File | null>(null);

    const handleSubmit = async () => {
        if (!name) return alert('Vui lòng nhập tên thương hiệu!');

        const formData = new FormData();
        formData.append('name', name);
        formData.append('origin', origin);
        if (file) formData.append('image', file); // Key 'image' hoặc 'logo' tùy backend

        try {
            let res: any = await createBrand(formData);
            if (res?.success) {
                alert('Thêm thành công!');
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
            <div className={styles.cardBox} style={{ maxWidth: '600px', margin: '0 auto', borderTopColor: '#28a745' }}>
                {/* Border xanh lá cho trang tạo mới */}
                <h2 style={{ color: '#28a745' }}>+ Thêm Thương Hiệu Mới</h2>

                <div className={styles.formGroup}>
                    <label>Tên Thương Hiệu:</label>
                    <input type="text" onChange={(e) => setName(e.target.value)} placeholder="VD: Apple, Samsung..." />
                </div>

                <div className={styles.formGroup}>
                    <label>Xuất xứ (Origin):</label>
                    <input
                        type="text"
                        onChange={(e) => setOrigin(e.target.value)}
                        placeholder="VD: Mỹ, Hàn Quốc, Việt Nam..."
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Logo / Hình ảnh:</label>
                    <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                </div>

                <div className={styles.btnGroup}>
                    <Link href="/admin/brands" className={styles.btnBack}>
                        Quay lại
                    </Link>
                    <button
                        className={styles.btnSubmit}
                        style={{ width: 'auto', background: '#28a745' }}
                        onClick={handleSubmit}
                    >
                        Lưu Thương Hiệu
                    </button>
                </div>
            </div>
        </div>
    );
}
