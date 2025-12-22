'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCategory } from '@/services/admin/categoryService';
import styles from '@/app/components/Admin/Categories/CreateCategory.module.scss';
import Link from 'next/link'; // Import Link

export default function CreateCategory() {
    const router = useRouter();
    const [name, setName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!name) return alert('Vui lòng nhập tên danh mục');

        setLoading(true);
        const formData = new FormData();
        formData.append('name', name);
        if (file) formData.append('image', file);

        try {
            let res: any = await createCategory(formData);
            if (res?.success) {
                alert('Tạo thành công!');
                router.push('/admin/categories');
            } else {
                alert(res.message);
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
            <div className={styles.cardBox} style={{ maxWidth: '600px', margin: '0 auto' }}>
                <h2>+ Thêm Danh Mục Mới</h2>

                <div className={styles.formGroup}>
                    <label>Tên danh mục:</label>
                    <input type="text" onChange={(e) => setName(e.target.value)} placeholder="VD: Điện thoại..." />
                </div>

                <div className={styles.formGroup}>
                    <label>Hình ảnh minh họa:</label>
                    <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                </div>

                <div className={styles.btnGroup}>
                    <Link href="/admin/categories" className={styles.btnBack}>
                        <i className="fas fa-arrow-left"></i> Quay lại
                    </Link>

                    <button className={styles.btnSubmit} onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Đang lưu...' : 'Lưu Danh Mục'}
                    </button>
                </div>
            </div>
        </div>
    );
}
