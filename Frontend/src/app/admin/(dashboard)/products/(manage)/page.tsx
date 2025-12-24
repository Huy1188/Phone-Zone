'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '@/app/components/Admin/Products/ProductManage.module.scss';
import { getAllProducts, deleteProduct } from '@/services/admin/productService';
import { getAllCategories } from '@/services/admin/categoryService';
import { getAllBrands } from '@/services/admin/brandService';

type Paging = {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
};

export default function ProductManagePage() {
    const [products, setProducts] = useState<any[]>([]);
    const [categories, setCategories] = useState<any[]>([]);
    const [brands, setBrands] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const [filters, setFilters] = useState({
        category_id: '',
        brand_id: '',
    });

    const [paging, setPaging] = useState<Paging>({
        page: 1,
        limit: 10,
        totalItems: 0,
        totalPages: 1,
    });

    const fetchMeta = async () => {
        try {
            const resCat: any = await getAllCategories();
            if (resCat?.success) setCategories(resCat?.data?.categories ?? []);
            else setCategories([]);

            const resBrand: any = await getAllBrands();
            if (resBrand?.success) setBrands(resBrand?.data?.brands ?? []);
            else setBrands([]);
        } catch (e) {
            console.error(e);
            setCategories([]);
            setBrands([]);
        }
    };

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const res: any = await getAllProducts({
                page: paging.page,
                limit: paging.limit,
                category_id: filters.category_id || '',
                brand_id: filters.brand_id || '',
            });

            if (res?.success) {
                setProducts(res?.data?.products ?? []);
                // BE trả paging ở đây
                if (res?.data?.paging) setPaging((prev) => ({ ...prev, ...res.data.paging }));
            } else {
                alert(res?.message || 'Không thể tải danh sách sản phẩm');
                setProducts([]);
            }
        } catch (e) {
            console.error(e);
            alert('Lỗi server');
            setProducts([]);
        } finally {
            setLoading(false);
        }
    };

    // load categories/brands 1 lần
    useEffect(() => {
        fetchMeta();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // fetch products mỗi khi page/limit/filter đổi
    useEffect(() => {
        fetchProducts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [paging.page, paging.limit, filters.category_id, filters.brand_id]);

    const formatMoney = (val: any) => {
        const num = Number(val || 0);
        return num.toLocaleString('vi-VN') + ' đ';
    };

    const handleDelete = async (id: number) => {
        if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
        try {
            const res: any = await deleteProduct(id);
            if (res?.success) {
                alert(res?.message || 'Xóa thành công');

                // nếu trang hiện tại xóa xong không còn item -> lùi 1 trang cho đẹp
                const willEmpty = products.length === 1 && paging.page > 1;
                if (willEmpty) setPaging((p) => ({ ...p, page: p.page - 1 }));
                else fetchProducts();
            } else {
                alert(res?.message || 'Xóa thất bại');
            }
        } catch (e) {
            console.error(e);
            alert('Lỗi server');
        }
    };

    const handleChangeFilter = (key: 'category_id' | 'brand_id', value: string) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
        // đổi filter thì về trang 1
        setPaging((prev) => ({ ...prev, page: 1 }));
    };

    const handleChangeLimit = (value: number) => {
        setPaging((prev) => ({ ...prev, limit: value, page: 1 }));
    };

    const goToPage = (p: number) => {
        if (p < 1 || p > paging.totalPages) return;
        setPaging((prev) => ({ ...prev, page: p }));
    };

    // render list số trang gọn: 1 ... 4 5 6 ... last
    const renderPageNumbers = () => {
        const total = paging.totalPages;
        const current = paging.page;

        if (total <= 7) {
            return Array.from({ length: total }, (_, i) => i + 1);
        }

        const pages: (number | '...')[] = [];
        const left = Math.max(2, current - 1);
        const right = Math.min(total - 1, current + 1);

        pages.push(1);
        if (left > 2) pages.push('...');

        for (let i = left; i <= right; i++) pages.push(i);

        if (right < total - 1) pages.push('...');
        pages.push(total);

        return pages;
    };

    return (
        <div className={styles.container}>
            <div className={styles.cardBox}>
                <div className={styles.cardHeader}>
                    <h2>
                        <i className="fas fa-box"></i> Danh sách sản phẩm
                    </h2>

                    <div className={styles.headerActions}>
                        <Link href="/admin/products/create" className={styles.btnCreate}>
                            <i className="fas fa-plus"></i> Thêm sản phẩm
                        </Link>
                    </div>
                </div>

                {/* FILTER BAR */}
                <div className={styles.filterBar}>
                    <div className={styles.filterItem}>
                        <label>Danh mục</label>
                        <select
                            value={filters.category_id}
                            onChange={(e) => handleChangeFilter('category_id', e.target.value)}
                        >
                            <option value="">Tất cả</option>
                            {categories.map((c) => (
                                <option key={c.category_id} value={String(c.category_id)}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterItem}>
                        <label>Thương hiệu</label>
                        <select
                            value={filters.brand_id}
                            onChange={(e) => handleChangeFilter('brand_id', e.target.value)}
                        >
                            <option value="">Tất cả</option>
                            {brands.map((b) => (
                                <option key={b.brand_id} value={String(b.brand_id)}>
                                    {b.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className={styles.filterItem}>
                        <label>Hiển thị</label>
                        <select value={paging.limit} onChange={(e) => handleChangeLimit(Number(e.target.value))}>
                            <option value={5}>5 / trang</option>
                            <option value={10}>10 / trang</option>
                            <option value={20}>20 / trang</option>
                        </select>
                    </div>

                    <button
                        className={styles.btnClear}
                        onClick={() => {
                            setFilters({ category_id: '', brand_id: '' });
                            setPaging((p) => ({ ...p, page: 1 }));
                        }}
                        disabled={!filters.category_id && !filters.brand_id}
                    >
                        Xóa lọc
                    </button>
                </div>

                {/* TABLE */}
                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: 80 }}>ID</th>
                                <th style={{ width: 300 }}>Tên</th>
                                <th style={{ width: 160 }}>Giá</th>
                                <th style={{ width: 130 }}>Danh mục</th>
                                <th style={{ width: 130 }}>Thương hiệu</th>
                                <th style={{ width: 140, textAlign: 'center' }}>Hành động</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className={styles.centerCell}>
                                        Đang tải...
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className={styles.emptyCell}>
                                        Chưa có sản phẩm.
                                    </td>
                                </tr>
                            ) : (
                                products.map((p) => (
                                    <tr key={p.product_id}>
                                        <td>#{p.product_id}</td>

                                        <td>
                                            <div className={styles.productName}>{p.name}</div>
                                        </td>

                                        <td className={styles.price}>{formatMoney(p.min_price)}</td>

                                        <td>{p.category?.name || '---'}</td>
                                        <td>{p.brand?.name || '---'}</td>

                                        <td style={{ textAlign: 'center' }}>
                                            <div className={styles.actionGroup}>
                                                <Link
                                                    href={`/admin/products/edit/${p.product_id}`}
                                                    className={`${styles.actionBtn} ${styles.edit}`}
                                                >
                                                    <i className="fas fa-edit"></i>
                                                </Link>

                                                <button
                                                    type="button"
                                                    onClick={() => handleDelete(p.product_id)}
                                                    className={`${styles.actionBtn} ${styles.delete}`}
                                                >
                                                    <i className="fas fa-trash"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>

                    {/* PAGINATION */}
                    <div className={styles.paginationBar}>
                        <div className={styles.pagingInfo}>
                            Trang <b>{paging.page}</b> / <b>{paging.totalPages}</b> — Tổng <b>{paging.totalItems}</b>{' '}
                            sản phẩm
                        </div>

                        <div className={styles.pagination}>
                            <button
                                className={styles.pageBtn}
                                onClick={() => goToPage(paging.page - 1)}
                                disabled={paging.page <= 1 || loading}
                            >
                                ‹
                            </button>

                            {renderPageNumbers().map((p, idx) =>
                                p === '...' ? (
                                    <span key={`dots-${idx}`} className={styles.dots}>
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        key={p}
                                        className={`${styles.pageBtn} ${p === paging.page ? styles.active : ''}`}
                                        onClick={() => goToPage(p)}
                                        disabled={loading}
                                    >
                                        {p}
                                    </button>
                                ),
                            )}

                            <button
                                className={styles.pageBtn}
                                onClick={() => goToPage(paging.page + 1)}
                                disabled={paging.page >= paging.totalPages || loading}
                            >
                                ›
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
