'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getCategoryById, updateCategory } from '@/services/admin/categoryService';
import styles from '@/app/components/Admin/Categories/EditCategory.module.scss';
import Link from 'next/link';

export default function EditCategory() {
    const router = useRouter();
    const params = useParams();
    const categoryId = params?.id;

    const [name, setName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [previewImg, setPreviewImg] = useState('');

    useEffect(() => {
        if (categoryId) fetchDetail(Number(categoryId));
    }, [categoryId]);

    const fetchDetail = async (id: number) => {
        let res: any = await getCategoryById(id);
        if (res?.success && res.data) {
            setName(res.data.name);
            setPreviewImg(res.data.image);
        }
    };

    const handleSubmit = async () => {
        if (!name) return alert('Vui lòng nhập tên danh mục');
        const formData = new FormData();
        formData.append('name', name);
        if (file) formData.append('image', file);

        try {
            let res: any = await updateCategory(categoryId as string, formData);

            if (res?.success) {
                alert('Cập nhật thành công!');
                router.push('/admin/categories');
            } else {
                alert(res.message);
            }
        } catch (e) {
            alert('Lỗi hệ thống');
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.cardBox} style={{ maxWidth: '600px' }}>
                <h2>
                    <i className="fas fa-edit"></i> Sửa Danh Mục
                </h2>

                <div className={styles.formGroup}>
                    <label>Tên danh mục:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Nhập tên danh mục..."
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Hình ảnh hiện tại:</label>
                    {previewImg ? (
                        <div>
                            <img src={previewImg} className={styles.previewImage} alt="Preview" />
                        </div>
                    ) : (
                        <p style={{ fontSize: '13px', color: '#999' }}>Chưa có ảnh</p>
                    )}
                </div>

                <div className={styles.formGroup}>
                    <label>Chọn ảnh mới (Nếu muốn thay đổi):</label>
                    <input type="file" onChange={(e) => setFile(e.target.files ? e.target.files[0] : null)} />
                </div>

                <div className={styles.btnGroup}>
                    <Link href="/admin/categories" style={{ color: '#666', fontSize: '14px', textDecoration: 'none' }}>
                        <i className="fas fa-chevron-left"></i> Quay lại
                    </Link>

                    <button className={styles.btnSubmit} onClick={handleSubmit}>
                        Lưu thay đổi
                    </button>
                </div>
            </div>
        </div>
    );
}
