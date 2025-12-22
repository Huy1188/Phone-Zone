'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/components/Admin/Products/ProductEdit.module.css';
import {
  getProductById,
  updateProduct,
  createVariant,
  deleteVariant,
} from '@/services/admin/productService';
import { getAllCategories } from '@/services/admin/categoryService';
import { getAllBrands } from '@/services/admin/brandService';

export default function EditProductPage() {
  const params = useParams();
  const id = Number(params?.id);

  const [product, setProduct] = useState<any>(null);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);

  const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

  const fetchData = async () => {
    const resProd: any = await getProductById(id);
    if (resProd?.success) {
      setProduct(resProd?.data?.product ?? resProd?.data ?? null);
    } else {
      alert(resProd?.message || 'Không thể tải sản phẩm');
    }

    const resCat: any = await getAllCategories();
    if (resCat?.success) setCategories(resCat?.data?.categories ?? resCat?.data ?? []);

    const resBrand: any = await getAllBrands();
    if (resBrand?.success) setBrands(resBrand?.data?.brands ?? resBrand?.data ?? []);
  };

  useEffect(() => {
    if (id) fetchData();
  }, [id]);

  const handleUpdate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);

    const res: any = await updateProduct(id, fd);
    if (res?.success) {
      alert(res?.message || 'Cập nhật thành công');
      fetchData();
    } else {
      alert(res?.message || 'Cập nhật thất bại');
    }
  };

  if (!product) {
    return (
      <div className={styles.container}>
        <p>Đang tải...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Sửa sản phẩm</h2>
        <Link href="/admin/products" className={styles.backBtn}>← Quay lại</Link>
      </div>

      <form className={styles.form} onSubmit={handleUpdate}>
        <input name="name" defaultValue={product.name} className={styles.input} required />
        <input name="min_price" defaultValue={product.min_price} className={styles.input} required />
        <textarea name="description" defaultValue={product.description} className={styles.textarea} />

        <select name="category_id" defaultValue={product.category_id} className={styles.select} required>
          <option value="">-- Chọn danh mục --</option>
          {categories.map((c) => (
            <option key={c.category_id} value={c.category_id}>{c.name}</option>
          ))}
        </select>

        <select name="brand_id" defaultValue={product.brand_id} className={styles.select} required>
          <option value="">-- Chọn thương hiệu --</option>
          {brands.map((b) => (
            <option key={b.brand_id} value={b.brand_id}>{b.name}</option>
          ))}
        </select>

        <div className={styles.imageRow}>
          {product.image && (
            <Image
              src={`${BACKEND_URL}${product.image}`}
              alt={product.name}
              width={240}
              height={140}
              style={{ objectFit: 'cover' }}
            />
          )}
          <input name="image" type="file" accept="image/*" className={styles.input} />
        </div>

        <button className={styles.btn} type="submit">Lưu thay đổi</button>
      </form>

      {/* Variants */}
      <div className={styles.variantSection}>
        <h3>Biến thể</h3>

        <div className={styles.variantList}>
          {(product.variants || []).map((v: any) => (
            <div key={v.variant_id} className={styles.variantCard}>
              <div><b>SKU:</b> {v.sku}</div>
              <div><b>Color:</b> {v.color}</div>
              <div><b>RAM/ROM:</b> {v.ram}/{v.rom}</div>
              <div><b>Price:</b> {v.price}</div>
              <div><b>Stock:</b> {v.stock}</div>

              <button
                className={styles.deleteBtn}
                onClick={async () => {
                  const res: any = await deleteVariant(v.variant_id);
                  if (res?.success) fetchData();
                  else alert(res?.message || 'Xóa biến thể thất bại');
                }}
              >
                Xóa biến thể
              </button>
            </div>
          ))}
          {(product.variants || []).length === 0 && <p>Chưa có biến thể.</p>}
        </div>

        <hr />

        <h4>Thêm biến thể</h4>
        <VariantForm
          onSubmit={async (payload) => {
            const res: any = await createVariant(id, payload);
            if (res?.success) fetchData();
            else alert(res?.message || 'Thêm biến thể thất bại');
          }}
        />
      </div>
    </div>
  );
}

function VariantForm({ onSubmit }: { onSubmit: (payload: any) => void }) {
  const [form, setForm] = useState<any>({
    sku: '',
    color: '',
    ram: '',
    rom: '',
    price: '',
    stock: '',
    image: '',
  });

  return (
    <div style={{ display: 'grid', gap: 8, maxWidth: 520 }}>
      <input placeholder="SKU" value={form.sku} onChange={(e) => setForm({ ...form, sku: e.target.value })} />
      <input placeholder="Color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })} />
      <input placeholder="RAM" value={form.ram} onChange={(e) => setForm({ ...form, ram: e.target.value })} />
      <input placeholder="ROM" value={form.rom} onChange={(e) => setForm({ ...form, rom: e.target.value })} />
      <input placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} />
      <input placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} />
      <input placeholder="Image URL (optional)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />

      <button onClick={() => onSubmit(form)}>Thêm</button>
    </div>
  );
}
