'use client';
import React, { useEffect, useState } from 'react';
import styles from '@/app/components/Admin/Products/ProductCreate.module.css';
import Link from 'next/link';
import { createProduct } from '@/services/admin/productService';
import { getAllCategories } from '@/services/admin/categoryService';
import { getAllBrands } from '@/services/admin/brandService';


export default function CreateProductPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  const fetchMeta = async () => {
    const resCat: any = await getAllCategories();
    if (resCat?.success) setCategories(resCat?.data?.categories ?? resCat?.data ?? []);

    const resBrand: any = await getAllBrands();
    if (resBrand?.success) setBrands(resBrand?.data?.brands ?? resBrand?.data ?? []);
  };

  useEffect(() => {
    fetchMeta();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const res: any = await createProduct(fd);
    if (res?.success) {
      alert(res?.message || 'Tạo sản phẩm thành công');
      e.currentTarget.reset();
    } else {
      alert(res?.message || 'Tạo sản phẩm thất bại');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Tạo sản phẩm</h2>
        <Link href="/admin/products" className={styles.backBtn}>← Quay lại</Link>
      </div>

      <form className={styles.form} onSubmit={handleSubmit}>
        <input name="name" placeholder="Tên sản phẩm" className={styles.input} required />
        <input name="min_price" placeholder="Giá" className={styles.input} required />
        <textarea name="description" placeholder="Mô tả" className={styles.textarea} />

        <select name="category_id" className={styles.select} required>
          <option value="">-- Chọn danh mục --</option>
          {categories.map((c) => (
            <option key={c.category_id} value={c.category_id}>{c.name}</option>
          ))}
        </select>

        <select name="brand_id" className={styles.select} required>
          <option value="">-- Chọn thương hiệu --</option>
          {brands.map((b) => (
            <option key={b.brand_id} value={b.brand_id}>{b.name}</option>
          ))}
        </select>

        <input name="image" type="file" accept="image/*" className={styles.input} required />

        <button type="submit" className={styles.btn}>Tạo sản phẩm</button>
      </form>
    </div>
  );
}
