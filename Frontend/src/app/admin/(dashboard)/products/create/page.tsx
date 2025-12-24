'use client';

import React, { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import styles from '@/app/components/Admin/Products/CreateProduct.module.scss';

import { createProduct } from '@/services/admin/productService';
import { getAllCategories } from '@/services/admin/categoryService';
import { getAllBrands } from '@/services/admin/brandService';

export default function CreateProductPage() {
    const router = useRouter();

    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [loadingMeta, setLoadingMeta] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [preview, setPreview] = useState<string>('');
    const [selectedFile, setSelectedFile] = useState<File | null>(null);

    // dùng để clear preview URL
    const previewUrl = useMemo(() => preview, [preview]);

    const fetchMeta = async () => {
        setLoadingMeta(true);
        try {
            const resCat: any = await getAllCategories();
            if (resCat?.success) setCategories(resCat?.data?.categories ?? resCat?.data ?? []);
            else setCategories([]);

            const resBrand: any = await getAllBrands();
            if (resBrand?.success) setBrands(resBrand?.data?.brands ?? resBrand?.data ?? []);
            else setBrands([]);
        } catch (e) {
            console.error(e);
            setCategories([]);
            setBrands([]);
        } finally {
            setLoadingMeta(false);
        }
    };

    useEffect(() => {
        fetchMeta();
        return () => {
            // cleanup blob URL
            if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onPickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        const f = e.target.files?.[0] || null;
        setSelectedFile(f);

        // cleanup cũ
        if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);

        if (f) {
            const url = URL.createObjectURL(f);
            setPreview(url);
        } else {
            setPreview('');
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (submitting) return;

        const fd = new FormData(e.currentTarget);

        // đảm bảo tên field đúng là "image"
        if (selectedFile) fd.set('image', selectedFile);

        setSubmitting(true);
        try {
            const res: any = await createProduct(fd);

            if (res?.success) {
                alert(res?.message || 'Tạo sản phẩm thành công!');
                router.push('/admin/products');
            } else {
                alert(res?.message || 'Tạo sản phẩm thất bại');
            }
        } catch (err: any) {
            console.error(err);
            alert(err?.response?.data?.message || 'Lỗi server');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.cardBox}>
                <div className={styles.cardHeader}>
                    <h2>
                        <i className="fas fa-plus-circle"></i> Tạo sản phẩm
                    </h2>
                </div>

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>
                                Tên sản phẩm <span className={styles.required}>*</span>
                            </label>
                            <input name="name" placeholder="VD: iPhone 15 Pro Max" required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>
                                Giá (min_price) <span className={styles.required}>*</span>
                            </label>
                            <input name="min_price" type="number" min="0" placeholder="VD: 30000000" required />
                        </div>

                        <div className={styles.formGroup}>
                            <label>
                                Danh mục <span className={styles.required}>*</span>
                            </label>
                            <select name="category_id" required disabled={loadingMeta}>
                                <option value="">{loadingMeta ? 'Đang tải...' : '-- Chọn danh mục --'}</option>
                                {categories.map((c) => (
                                    <option key={c.category_id} value={c.category_id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>
                                Thương hiệu <span className={styles.required}>*</span>
                            </label>
                            <select name="brand_id" required disabled={loadingMeta}>
                                <option value="">{loadingMeta ? 'Đang tải...' : '-- Chọn thương hiệu --'}</option>
                                {brands.map((b) => (
                                    <option key={b.brand_id} value={b.brand_id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={`${styles.formGroup} ${styles.full}`}>
                            <label>Mô tả</label>
                            <textarea name="description" placeholder="Mô tả ngắn về sản phẩm..." />
                        </div>

                        <div className={`${styles.formGroup} ${styles.full}`}>
                            <label>
                                Ảnh sản phẩm <span className={styles.required}>*</span>
                            </label>

                            <div className={styles.uploadRow}>
                                <input name="image" type="file" accept="image/*" required onChange={onPickFile} />
                                {preview ? (
                                    <div className={styles.previewWrap}>
                                        <img src={preview} alt="preview" className={styles.previewImg} />
                                        <button
                                            type="button"
                                            className={styles.clearPreview}
                                            onClick={() => {
                                                if (previewUrl?.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
                                                setPreview('');
                                                setSelectedFile(null);
                                            }}
                                        >
                                            Xóa ảnh
                                        </button>
                                    </div>
                                ) : (
                                    <div className={styles.previewEmpty}>Chưa chọn ảnh</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <Link href="/admin/products" className={styles.backBtn}>
                            <i className="fas fa-chevron-left"></i> Quay lại
                        </Link>
                        <button type="submit" className={styles.btnSubmit} disabled={submitting}>
                            {submitting ? (
                                <>
                                    <i className="fas fa-spinner fa-spin"></i> Đang tạo...
                                </>
                            ) : (
                                <>
                                    <i className="fas fa-save"></i> Tạo sản phẩm
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
