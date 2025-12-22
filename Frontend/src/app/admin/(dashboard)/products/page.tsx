'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import styles from '@/app/components/Admin/Products/ProductManage.module.css';
import { getAllProducts } from '@/services/admin/productService';
import { getAllCategories } from '@/services/admin/categoryService';
import { getAllBrands } from '@/services/admin/brandService';

export default function ProductManagePage() {
  const [products, setProducts] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [brands, setBrands] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res: any = await getAllProducts({ page: 1, limit: 10 });
      if (res?.success) {
        setProducts(res?.data?.products ?? res?.data ?? []);
      } else {
        alert(res?.message || 'Không thể tải danh sách sản phẩm');
      }

      const resCat: any = await getAllCategories();
      if (resCat?.success) setCategories(resCat?.data?.categories ?? resCat?.data ?? []);

      const resBrand: any = await getAllBrands();
      if (resBrand?.success) setBrands(resBrand?.data?.brands ?? resBrand?.data ?? []);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Quản lý sản phẩm</h2>
        <Link href="/admin/products/create" className={styles.createBtn}>+ Tạo sản phẩm</Link>
      </div>

      {loading ? (
        <p>Đang tải...</p>
      ) : (
        <div className={styles.list}>
          {products.map((p) => (
            <div key={p.product_id} className={styles.card}>
              <div className={styles.thumb}>
                {p.image ? (
                  <Image
                    src={`${BACKEND_URL}${p.image}`}
                    alt={p.name}
                    width={240}
                    height={140}
                    style={{ objectFit: 'cover' }}
                  />
                ) : (
                  <div className={styles.noimg}>No image</div>
                )}
              </div>

              <div className={styles.info}>
                <div className={styles.title}>{p.name}</div>
                <div>Giá: {p.min_price}</div>
                <div>Danh mục: {p.category?.name}</div>
                <div>Thương hiệu: {p.brand?.name}</div>
              </div>

              <div className={styles.actions}>
                <Link className={styles.smallBtn} href={`/admin/products/edit/${p.product_id}`}>Sửa</Link>
              </div>
            </div>
          ))}
          {products.length === 0 && <p>Chưa có sản phẩm.</p>}
        </div>
      )}
    </div>
  );
}
