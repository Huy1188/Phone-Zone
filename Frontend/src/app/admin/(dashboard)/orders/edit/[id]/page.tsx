'use client';

import { useEffect, useMemo, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import styles from '@/app/components/Admin/Orders/EditOrder.module.scss';
import { getOrderById, updateOrderStatus, downloadInvoice } from '@/services/admin/orderService';

export default function OrderDetailPage() {
    const router = useRouter();
    const params = useParams();
    const id = Number(params?.id);

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState<any>(null);
    const [details, setDetails] = useState<any[]>([]);
    const [status, setStatus] = useState('pending');

    const BACKEND_URL = (process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000/api').replace(/\/api\/?$/, '');

    const fetchDetail = async () => {
        setLoading(true);
        try {
            const res: any = await getOrderById(id);

            if (res?.success) {
                const data = res?.data ?? {};
                const o = data?.order ?? null;
                const ds = data?.orderDetails ?? [];

                setOrder(o);
                setDetails(Array.isArray(ds) ? ds : []);
                setStatus(String(o?.status || 'pending'));
            } else {
                alert(res?.message || 'Không tìm thấy đơn hàng');
                router.push('/admin/orders');
            }
        } catch (e) {
            console.error(e);
            alert('Lỗi hệ thống');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (id) fetchDetail();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    const formatCurrency = (amount: any) => {
        const n = Number(amount ?? 0);
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number.isNaN(n) ? 0 : n);
    };

    const getImageUrl = (img: string) => {
        if (!img) return '';
        return img.startsWith('http') ? img : `${BACKEND_URL}${img}`;
    };

    const customerName = useMemo(() => {
        const fn = order?.user?.first_name || '';
        const ln = order?.user?.last_name || '';
        const full = `${ln} ${fn}`.trim();
        return full || 'Khách vãng lai';
    }, [order]);

    const defaultAddress = useMemo(() => {
        const addrs = order?.user?.addresses || [];
        if (!Array.isArray(addrs) || addrs.length === 0) return 'Chưa cập nhật';
        const d = addrs.find((a: any) => a.is_default === true || a.is_default === 1) || addrs[0];
        return `${d.street || ''}${d.street ? ', ' : ''}${d.city || ''}`.trim() || 'Chưa cập nhật';
    }, [order]);

    const calcTotal = useMemo(() => {
        // ưu tiên total_price từ order
        if (order?.total_price != null) return Number(order.total_price);
        // fallback: tự tính từ details
        return details.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0), 0);
    }, [details, order]);

    const handleUpdateStatus = async () => {
        try {
            const res: any = await updateOrderStatus(id, status);

            if (res?.success) {
                alert(res?.message || 'Cập nhật trạng thái thành công!');
                await fetchDetail(); // luôn đồng bộ lại order + details
                router.push('/admin/orders');
                return;
            }

            alert(res?.message || 'Cập nhật thất bại');
        } catch (e: any) {
            console.error(e);
            alert(e?.response?.data?.message || 'Lỗi khi cập nhật trạng thái');
        }
    };

    if (loading) return <div className={styles.container}>Đang tải...</div>;
    if (!order) return <div className={styles.container}>Đơn hàng không tồn tại</div>;

    return (
        <div className={styles.container}>
            <div className={styles.cardBox}>
                <div className={styles.cardHeader}>
                    <h2>
                        <i className="fas fa-file-invoice-dollar"></i> Chi tiết đơn hàng #{id}
                    </h2>

                    <Link href="/admin/orders" className={styles.backBtn}>
                        <i className="fas fa-chevron-left"></i> Quay lại
                    </Link>
                </div>

                <div className={styles.topGrid}>
                    <div className={styles.infoBox}>
                        <div className={styles.boxTitle}>Thông tin khách hàng</div>
                        <div className={styles.row}>
                            <span>Họ tên</span>
                            <b>{customerName}</b>
                        </div>
                        <div className={styles.row}>
                            <span>Email</span>
                            <b>{order?.user?.email || '---'}</b>
                        </div>
                        <div className={styles.row}>
                            <span>SĐT</span>
                            <b>{order?.user?.phone || '---'}</b>
                        </div>
                        <div className={styles.row}>
                            <span>Địa chỉ</span>
                            <b>{defaultAddress}</b>
                        </div>
                    </div>

                    <div className={styles.statusBox}>
                        <div className={styles.boxTitle}>Cập nhật trạng thái</div>

                        <label className={styles.label}>Trạng thái</label>
                        <select className={styles.select} value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="pending">⏳ Chờ xác nhận</option>
                            <option value="shipping">🚚 Đang giao hàng</option>
                            <option value="delivered">✅ Thành công</option>
                            <option value="cancelled">❌ Đã hủy</option>
                        </select>

                        <button className={styles.saveBtn} onClick={handleUpdateStatus}>
                            <i className="fas fa-save"></i> Lưu trạng thái
                        </button>
                    </div>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th style={{ width: 80 }}>Ảnh</th>
                                <th>Tên sản phẩm</th>
                                <th style={{ width: 160 }}>Phân loại</th>
                                <th style={{ width: 140 }}>Đơn giá</th>
                                <th style={{ width: 100, textAlign: 'center' }}>SL</th>
                                <th style={{ width: 160, textAlign: 'right' }}>Thành tiền</th>
                            </tr>
                        </thead>

                        <tbody>
                            {details.length > 0 ? (
                                details.map((item: any, idx: number) => {
                                    // ✅ ƯU TIÊN tên thật từ Product (variant.product.name)
                                    // fallback mới là snapshot product_name
                                    const name = item.variant?.product?.name || item.product_name || '---';

                                    // ảnh ưu tiên variant.image, fallback product.image
                                    const img = item.variant?.image || item.variant?.product?.image || '';

                                    // phân loại ưu tiên variant_label do BE build sẵn, fallback sku
                                    const variantLabel = item.variant_label || item.variant?.sku || '---';

                                    return (
                                        <tr key={idx}>
                                            <td>
                                                {img ? (
                                                    // eslint-disable-next-line @next/next/no-img-element
                                                    <img
                                                        className={styles.thumb}
                                                        src={getImageUrl(img)}
                                                        alt="product"
                                                    />
                                                ) : (
                                                    <div className={styles.noThumb}>No</div>
                                                )}
                                            </td>

                                            <td>
                                                <div className={styles.pname}>{name}</div>
                                            </td>

                                            <td className={styles.variantText}>{variantLabel}</td>

                                            <td>{formatCurrency(item.price)}</td>

                                            <td style={{ textAlign: 'center', fontWeight: 700 }}>{item.quantity}</td>

                                            <td style={{ textAlign: 'right', fontWeight: 600 }}>
                                                {formatCurrency(Number(item.price || 0) * Number(item.quantity || 0))}
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={6} style={{ textAlign: 'center', padding: 18 }}>
                                        Không có sản phẩm nào
                                    </td>
                                </tr>
                            )}
                        </tbody>

                        <tfoot>
                            <tr>
                                <td>
                                    <button
                                        type="button"
                                        className={styles.invoiceBtn}
                                        onClick={async () => {
                                            try {
                                                const blob: any = await downloadInvoice(Number(id));
                                                // axiosClient interceptor của bạn đang return data,
                                                // nhưng với responseType blob thì thường trả ra Blob luôn.
                                                const fileBlob =
                                                    blob instanceof Blob
                                                        ? blob
                                                        : new Blob([blob], { type: 'application/pdf' });

                                                const url = window.URL.createObjectURL(fileBlob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = `invoice-order-${id}.pdf`;
                                                a.click();
                                                window.URL.revokeObjectURL(url);
                                            } catch (e: any) {
                                                console.error(e);
                                                alert('Khong tai duoc hoa don. Kiem tra dang nhap hoac API.');
                                            }
                                        }}
                                    >
                                        Xuất hoá đơn (PDF)
                                    </button>
                                </td>
                                <td colSpan={5} style={{ textAlign: 'right', fontWeight: 600 }}>
                                    Tổng tiền thanh toán:
                                </td>
                                <td style={{ textAlign: 'right' }} className={styles.totalMoney}>
                                    {formatCurrency(calcTotal)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>
        </div>
    );
}
