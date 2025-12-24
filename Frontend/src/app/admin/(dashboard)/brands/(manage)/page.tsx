'use client';
import { useEffect, useState } from 'react';
import { getAllBrands, deleteBrand } from '@/services/admin/brandService';
import { Brand } from '@/types/product';
import Link from 'next/link';
import styles from '@/app/components/Admin/Brands/Brand.module.scss';

export default function BrandPage() {
    const [brands, setBrands] = useState<Brand[]>([]);

    useEffect(() => {
        fetchBrands();
    }, []);

    const fetchBrands = async () => {
        try {
            const res: any = await getAllBrands();

            // Vì axiosClient đã return response.data nên res chính là JSON backend trả về
            if (res?.success) {
                // Backend thường trả: ok(res, { brands }, ...)
                const list = res?.data?.brands ?? res?.data ?? [];
                setBrands(Array.isArray(list) ? list : []);
            } else {
                alert(res?.message || 'Không tải được danh sách thương hiệu');
                setBrands([]);
            }
        } catch (e) {
            console.error(e);
            setBrands([]);
        }
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc muốn xóa thương hiệu này?')) return;
        try {
            let res: any = await deleteBrand(id);
            if (res?.success) {
                alert('Xóa thành công');
                fetchBrands();
            } else alert(res.message);
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.cardBox}>
                <h2>Quản Lý Thương Hiệu</h2>
                <Link href="/admin/brands/create" className={styles.btnAdd}>
                    <i className="fas fa-plus"></i> Thêm Thương Hiệu
                </Link>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: '50px' }}>ID</th>
                            <th style={{ width: '100px' }}>Logo</th>
                            <th>Tên Thương Hiệu</th>
                            <th>Xuất xứ</th>
                            <th>Slug</th>
                            <th style={{ width: '200px', textAlign: 'center' }}>Hành động</th>
                        </tr>
                    </thead>
                    <tbody>
                        {brands.map((item) => (
                            <tr key={item.brand_id}>
                                <td>{item.brand_id}</td>
                                <td>
                                    {item.logo_url ? (
                                        <img src={item.logo_url} className={styles.brandLogo} alt="logo" />
                                    ) : (
                                        <span style={{ color: '#999', fontSize: 12 }}>No Logo</span>
                                    )}
                                </td>
                                <td>
                                    <b>{item.name}</b>
                                </td>
                                <td>{item.origin || '---'}</td>
                                <td style={{ color: '#6f42c1' }}>{item.slug}</td>
                                <td style={{ textAlign: 'center' }}>
                                    <div className={styles.actionGroup}>
                                        <Link
                                            href={`/admin/brands/edit/${item.brand_id}`}
                                            className={`${styles.actionBtn} ${styles.edit}`}
                                        >
                                            <i className="fas fa-edit"></i> Sửa
                                        </Link>

                                        <button
                                            onClick={() => handleDelete(item.brand_id)}
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
