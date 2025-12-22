'use client';
import { useEffect, useState } from 'react';
import { getAllCategories, deleteCategory } from '@/services/admin/categoryService';
import { Category } from '@/types/product';
import Link from 'next/link';
import styles from '@/app/components/Admin/Categories/Category.module.scss';

export default function CategoryPage() {
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        let res: any = await getAllCategories();
        if (res?.success) setCategories(Array.isArray(res?.data?.categories) ? res.data.categories : []);
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc muốn xóa danh mục này?')) return;
        try {
            let res: any = await deleteCategory(id);
            if (res?.success) {
                alert('Xóa thành công');
                fetchCategories();
            } else alert(res.message);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.cardBox}>
                <h2>Quản lý Danh mục sản phẩm</h2>
                <Link href="/admin/categories/create" className={styles.btnAdd}>
                    <i className="fas fa-plus-circle"></i> Thêm danh mục mới
                </Link>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '50px' }}>ID</th>
                            <th style={{ width: '100px' }}>Hình ảnh</th>
                            <th>Tên danh mục</th>
                            <th>Slug</th>
                            <th style={{ width: '180px' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((item) => (
                            <tr key={item.category_id}>
                                <td>{item.category_id}</td>
                                <td>
                                    {item.image ? (
                                        <img src={item.image} className={styles.catImg} alt="img" />
                                    ) : (
                                        'No Image'
                                    )}
                                </td>
                                <td>
                                    <b>{item.name}</b>
                                </td>
                                <td style={{ color: '#007bff' }}>{item.slug}</td>
                                <td>
                                    <div className={styles.actionGroup}>
                                        <Link
                                            href={`/admin/categories/edit/${item.category_id}`}
                                            className={`${styles.actionBtn} ${styles.edit}`}
                                        >
                                            <i className="fas fa-edit"></i> Sửa
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(item.category_id)}
                                            className={`${styles.actionBtn} ${styles.delete}`}
                                        >
                                            <i className="fas fa-trash"></i> Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
