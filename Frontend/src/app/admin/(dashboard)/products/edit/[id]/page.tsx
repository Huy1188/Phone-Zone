'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import styles from '@/app/components/Admin/Products/EditProduct.module.scss';
import { getProductById, updateProduct, createVariant, deleteVariant } from '@/services/admin/productService';
import { getAllCategories } from '@/services/admin/categoryService';
import { getAllBrands } from '@/services/admin/brandService';

type ProductForm = {
    name: string;
    min_price: string;
    description: string;
    category_id: string;
    brand_id: string;
};

export default function EditProductPage() {
    const params = useParams();
    const id = Number(params?.id);

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [product, setProduct] = useState<any>(null);
    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);

    const [form, setForm] = useState<ProductForm>({
        name: '',
        min_price: '',
        description: '',
        category_id: '',
        brand_id: '',
    });

    const [file, setFile] = useState<File | null>(null);

    const BACKEND_URL = useMemo(() => {
        return (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');
    }, []);

    const previewImg = useMemo(() => {
        const img = product?.image ? `${BACKEND_URL}${product.image}` : '';
        return img;
    }, [product?.image, BACKEND_URL]);

    const fetchData = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const [resProd, resCat, resBrand]: any = await Promise.all([
                getProductById(id),
                getAllCategories(),
                getAllBrands(),
            ]);

            if (resProd?.success) {
                const p = resProd?.data?.product ?? resProd?.data ?? null;
                setProduct(p);

                // luôn ép về string để tránh controlled/uncontrolled
                setForm({
                    name: String(p?.name ?? ''),
                    min_price: String(p?.min_price ?? ''),
                    description: String(p?.description ?? ''),
                    category_id: String(p?.category_id ?? ''),
                    brand_id: String(p?.brand_id ?? ''),
                });
            } else {
                alert(resProd?.message || 'Không thể tải sản phẩm');
            }

            setCategories(resCat?.success ? resCat?.data?.categories ?? resCat?.data ?? [] : []);
            setBrands(resBrand?.success ? resBrand?.data?.brands ?? resBrand?.data ?? [] : []);
        } catch (e) {
            console.error(e);
            alert('Lỗi tải dữ liệu');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!form.name.trim()) return alert('Vui lòng nhập tên sản phẩm');
        if (!form.min_price.trim()) return alert('Vui lòng nhập giá');
        if (!form.category_id) return alert('Vui lòng chọn danh mục');
        if (!form.brand_id) return alert('Vui lòng chọn thương hiệu');

        setSaving(true);
        try {
            const fd = new FormData();
            fd.append('name', form.name);
            fd.append('min_price', form.min_price);
            fd.append('description', form.description || '');
            fd.append('category_id', form.category_id);
            fd.append('brand_id', form.brand_id);

            if (file) fd.append('image', file);

            const res: any = await updateProduct(id, fd);
            if (res?.success) {
                alert(res?.message || 'Cập nhật thành công');
                await fetchData();
            } else {
                alert(res?.message || 'Cập nhật thất bại');
            }
        } catch (err) {
            console.error(err);
            alert('Lỗi hệ thống');
        } finally {
            setSaving(false);
        }
    };

    const handleDeleteVariant = async (variantId: number) => {
        if (!confirm('Xóa biến thể này?')) return;
        try {
            const res: any = await deleteVariant(variantId);
            if (res?.success) {
                alert(res?.message || 'Đã xóa biến thể');
                fetchData();
            } else {
                alert(res?.message || 'Xóa biến thể thất bại');
            }
        } catch (e) {
            console.error(e);
            alert('Lỗi hệ thống');
        }
    };

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.cardBox}>
                    <div className={styles.cardHeader}>
                        <h2>
                            <i className="fas fa-box"></i> Sửa sản phẩm
                        </h2>
                        <Link href="/admin/products" className={styles.backBtn}>
                            <i className="fas fa-chevron-left"></i> Quay lại
                        </Link>
                    </div>
                    <div style={{ padding: 18 }}>Đang tải...</div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className={styles.container}>
                <div className={styles.cardBox}>
                    <div className={styles.cardHeader}>
                        <h2>
                            <i className="fas fa-box"></i> Sửa sản phẩm
                        </h2>
                        <Link href="/admin/products" className={styles.backBtn}>
                            <i className="fas fa-chevron-left"></i> Quay lại
                        </Link>
                    </div>
                    <div style={{ padding: 18 }}>Không tìm thấy sản phẩm.</div>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            <div className={styles.cardBox}>
                {/* HEADER */}
                <div className={styles.cardHeader}>
                    <h2>
                        <i className="fas fa-box"></i> Sửa sản phẩm #{product.product_id}
                    </h2>
                    <Link href="/admin/products" className={styles.backBtn}>
                        <i className="fas fa-chevron-left"></i> Quay lại
                    </Link>
                </div>

                {/* FORM */}
                <form className={styles.form} onSubmit={handleUpdate}>
                    <div className={styles.grid}>
                        <div className={styles.formGroup}>
                            <label>Tên sản phẩm</label>
                            <input name="name" value={form.name} onChange={handleChange} placeholder="Nhập tên..." />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Giá (min_price)</label>
                            <input
                                name="min_price"
                                value={form.min_price}
                                onChange={handleChange}
                                placeholder="Nhập giá..."
                            />
                        </div>

                        <div className={`${styles.formGroup} ${styles.full}`}>
                            <label>Mô tả</label>
                            <textarea
                                name="description"
                                value={form.description}
                                onChange={handleChange}
                                placeholder="Nhập mô tả..."
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Danh mục</label>
                            <select name="category_id" value={form.category_id} onChange={handleChange}>
                                <option value="">-- Chọn danh mục --</option>
                                {categories.map((c) => (
                                    <option key={c.category_id} value={c.category_id}>
                                        {c.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Thương hiệu</label>
                            <select name="brand_id" value={form.brand_id} onChange={handleChange}>
                                <option value="">-- Chọn thương hiệu --</option>
                                {brands.map((b) => (
                                    <option key={b.brand_id} value={b.brand_id}>
                                        {b.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className={`${styles.formGroup} ${styles.full}`}>
                            <label>Hình ảnh</label>

                            <div className={styles.imageRow}>
                                <div className={styles.currentImage}>
                                    {previewImg ? (
                                        <Image
                                            src={previewImg}
                                            alt={form.name || 'product'}
                                            width={600}
                                            height={360}
                                            className={styles.previewImg}
                                        />
                                    ) : (
                                        <div className={styles.noImg}>Chưa có ảnh</div>
                                    )}
                                </div>

                                <div className={styles.uploadBox}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                                    />
                                    {file && (
                                        <button type="button" className={styles.clearBtn} onClick={() => setFile(null)}>
                                            <i className="fas fa-times"></i> Bỏ chọn ảnh
                                        </button>
                                    )}
                                    <div style={{ fontSize: 12, color: '#6b7280' }}>
                                        * Không chọn ảnh mới thì giữ ảnh cũ.
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className={styles.footer}>
                        <button className={styles.btnSubmit} type="submit" disabled={saving}>
                            {saving ? (
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
                </form>

                {/* VARIANTS TABLE */}
                <div className={styles.variantSection}>
                    <div className={styles.variantHeader}>
                        <h3>
                            <i className="fas fa-layer-group"></i> Biến thể ({(product.variants || []).length})
                        </h3>
                    </div>

                    <div className={styles.tableWrapper}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>SKU</th>
                                    <th>Màu</th>
                                    <th>RAM</th>
                                    <th>ROM</th>
                                    <th>Giá</th>
                                    <th>Tồn</th>
                                    <th style={{ textAlign: 'center' }}>Xóa</th>
                                </tr>
                            </thead>
                            <tbody>
                                {(product.variants || []).length > 0 ? (
                                    (product.variants || []).map((v: any) => (
                                        <tr key={v.variant_id}>
                                            <td>#{v.variant_id}</td>
                                            <td>{v.sku || '---'}</td>
                                            <td>{v.color || '---'}</td>
                                            <td>{v.ram || '---'}</td>
                                            <td>{v.rom || '---'}</td>
                                            <td>{v.price ?? '---'}</td>
                                            <td>{v.stock ?? '---'}</td>
                                            <td style={{ textAlign: 'center' }}>
                                                <button
                                                    type="button"
                                                    className={styles.iconBtn}
                                                    onClick={() => handleDeleteVariant(v.variant_id)}
                                                    title="Xóa biến thể"
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan={8} style={{ textAlign: 'center', padding: 16 }}>
                                            Chưa có biến thể.
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* ADD VARIANT */}
                    <VariantForm
                        onSubmit={async (fd) => {
                            const res: any = await createVariant(id, fd);
                            if (res?.success) {
                                alert(res?.message || 'Thêm biến thể thành công');
                                fetchData();
                            } else {
                                alert(res?.message || 'Thêm biến thể thất bại');
                            }
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

function VariantForm({ onSubmit }: { onSubmit: (payload: FormData) => void }) {
    const [saving, setSaving] = useState(false);
    const [v, setV] = useState({
        sku: '',
        color: '',
        ram: '',
        rom: '',
        price: '',
        stock: '',
        image: '',
    });

    const handleAdd = async () => {
        if (!v.sku.trim() || !v.price.trim() || !v.stock.trim()) {
            alert('Vui lòng nhập tối thiểu SKU, Price, Stock');
            return;
        }

        setSaving(true);
        try {
            const fd = new FormData();
            fd.append('sku', v.sku);
            fd.append('color', v.color);
            fd.append('ram', v.ram);
            fd.append('rom', v.rom);
            fd.append('price', v.price);
            fd.append('stock', v.stock);
            fd.append('image', v.image);

            await onSubmit(fd);
            setV({ sku: '', color: '', ram: '', rom: '', price: '', stock: '', image: '' });
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className={styles.variantFormBox}>
            <h4>
                <i className="fas fa-plus-circle"></i> Thêm biến thể
            </h4>

            <div className={styles.variantForm}>
                <input
                    className={styles.variantInput}
                    placeholder="SKU"
                    value={v.sku}
                    onChange={(e) => setV((p) => ({ ...p, sku: e.target.value }))}
                />
                <input
                    className={styles.variantInput}
                    placeholder="Màu"
                    value={v.color}
                    onChange={(e) => setV((p) => ({ ...p, color: e.target.value }))}
                />
                <input
                    className={styles.variantInput}
                    placeholder="RAM"
                    value={v.ram}
                    onChange={(e) => setV((p) => ({ ...p, ram: e.target.value }))}
                />
                <input
                    className={styles.variantInput}
                    placeholder="ROM"
                    value={v.rom}
                    onChange={(e) => setV((p) => ({ ...p, rom: e.target.value }))}
                />
                <input
                    className={styles.variantInput}
                    placeholder="Giá"
                    value={v.price}
                    onChange={(e) => setV((p) => ({ ...p, price: e.target.value }))}
                />
                <input
                    className={styles.variantInput}
                    placeholder="Tồn kho"
                    value={v.stock}
                    onChange={(e) => setV((p) => ({ ...p, stock: e.target.value }))}
                />
                <input
                    className={styles.variantInput}
                    placeholder="Image URL (optional)"
                    value={v.image}
                    onChange={(e) => setV((p) => ({ ...p, image: e.target.value }))}
                />

                <button type="button" className={styles.variantBtn} onClick={handleAdd} disabled={saving}>
                    {saving ? 'Đang thêm...' : 'Thêm biến thể'}
                </button>
            </div>
        </div>
    );
}
