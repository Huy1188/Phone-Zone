'use client';
import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getOrderById, updateOrderStatus } from '@/services/admin/orderService';
import styles from '@/app/components/Admin/Products/ProductManage.module.scss'; // Dùng chung style với Product

const BACKEND_URL = 'http://localhost:8080'; // URL để hiện ảnh sản phẩm

export default function OrderDetail({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();

    const [order, setOrder] = useState<any>(null);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (id) fetchDetail();
    }, [id]);

    const fetchDetail = async () => {
        try {
            let res: any = await getOrderById(Number(id));
            if (res?.success) {
                setOrder(res.data);
                setStatus(res.data.status); // Set trạng thái hiện tại
            } else {
                alert('Không tìm thấy đơn hàng');
            }
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateStatus = async () => {
        if (!status) return;
        try {
            let res: any = await updateOrderStatus({
                order_id: Number(id),
                status: status,
            });

            if (res?.success) {
                alert('Cập nhật trạng thái thành công!');
                fetchDetail(); // Load lại để cập nhật giao diện
            } else {
                alert(res.message);
            }
        } catch (e) {
            alert('Lỗi hệ thống');
        }
    };

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    const getImageUrl = (img: string) => (img?.startsWith('http') ? img : `${BACKEND_URL}${img}`);

    if (loading) return <div className={styles.container}>Đang tải...</div>;
    if (!order) return <div className={styles.container}>Đơn hàng không tồn tại</div>;

    return (
        <div className={styles.container}>
            <div className={styles.cardBox} style={{ maxWidth: '900px', margin: '0 auto' }}>
                {/* --- HEADER: Tiêu đề + Nút Quay lại --- */}
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        borderBottom: '1px solid #eee',
                        paddingBottom: 15,
                        marginBottom: 20,
                    }}
                >
                    <h2 style={{ margin: 0, border: 0, padding: 0 }}>
                        <i className="fas fa-file-invoice-dollar"></i> Chi tiết Đơn hàng #{id}
                    </h2>
                    <Link href="/admin/orders" className={styles.btnCancel}>
                        « Quay lại danh sách
                    </Link>
                </div>

                {/* --- PHẦN 1: THÔNG TIN KHÁCH HÀNG & TRẠNG THÁI --- */}
                <div className={styles.formGrid}>
                    {/* Cột Trái: Thông tin người nhận */}
                    <div style={{ background: '#f8f9fa', padding: 15, borderRadius: 6 }}>
                        <h4 style={{ marginTop: 0, color: '#555', borderBottom: '1px dashed #ccc', paddingBottom: 5 }}>
                            Thông tin khách hàng
                        </h4>
                        <p>
                            <b>Họ tên:</b> {order.user?.username || 'Khách vãng lai'}
                        </p>
                        <p>
                            <b>Email:</b> {order.user?.email}
                        </p>
                        <p>
                            <b>SĐT:</b> {order.user?.phone}
                        </p>
                        <p>
                            <b>Địa chỉ:</b> {order.user?.address || 'Chưa cập nhật'}
                        </p>
                    </div>

                    {/* Cột Phải: Cập nhật Trạng thái */}
                    <div style={{ background: '#e3f2fd', padding: 15, borderRadius: 6, border: '1px solid #b3d7ff' }}>
                        <h4
                            style={{
                                marginTop: 0,
                                color: '#0056b3',
                                borderBottom: '1px dashed #9ec5fe',
                                paddingBottom: 5,
                            }}
                        >
                            Cập nhật Trạng thái
                        </h4>

                        <div className={styles.formGroup} style={{ marginTop: 15 }}>
                            <label>Trạng thái đơn hàng:</label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                style={{
                                    fontWeight: 'bold',
                                    color: status === 'cancelled' ? 'red' : status === 'succeeded' ? 'green' : '#333',
                                }}
                            >
                                <option value="pending">⏳ Chờ xác nhận</option>
                                <option value="shipping">🚚 Đang giao hàng</option>
                                <option value="succeeded">✅ Thành công (Đã giao)</option>
                                <option value="cancelled">❌ Đã hủy</option>
                            </select>
                        </div>

                        <button
                            className={styles.btnAdd}
                            style={{ width: '100%', justifyContent: 'center', marginTop: 10 }}
                            onClick={handleUpdateStatus}
                        >
                            <i className="fas fa-save"></i> Lưu Trạng Thái
                        </button>
                    </div>
                </div>

                {/* --- PHẦN 2: DANH SÁCH SẢN PHẨM --- */}
                <h3 style={{ marginTop: 30, fontSize: 16 }}>Danh sách sản phẩm</h3>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th style={{ width: 60 }}>Ảnh</th>
                            <th>Tên sản phẩm</th>
                            <th>Phân loại</th>
                            <th>Đơn giá</th>
                            <th>Số lượng</th>
                            <th style={{ textAlign: 'right' }}>Thành tiền</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.details && order.details.length > 0 ? (
                            order.details.map((item: any, index: number) => (
                                <tr key={index}>
                                    <td>
                                        <img
                                            src={getImageUrl(item.product?.image)}
                                            alt="product"
                                            className={styles.imgPreview}
                                        />
                                    </td>
                                    <td>
                                        <div style={{ fontWeight: 600 }}>{item.product?.name}</div>
                                    </td>
                                    <td>
                                        {item.color} - {item.rom}
                                    </td>{' '}
                                    {/* Giả sử bạn lưu biến thể vào order detail */}
                                    <td>{formatCurrency(item.price)}</td>
                                    <td style={{ textAlign: 'center' }}>{item.quantity}</td>
                                    <td style={{ textAlign: 'right', fontWeight: 'bold', color: '#333' }}>
                                        {formatCurrency(item.price * item.quantity)}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} style={{ textAlign: 'center' }}>
                                    Không có sản phẩm nào
                                </td>
                            </tr>
                        )}
                    </tbody>

                    {/* Footer bảng tổng tiền */}
                    <tfoot>
                        <tr style={{ background: '#fafafa' }}>
                            <td colSpan={5} style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 16 }}>
                                Tổng tiền thanh toán:
                            </td>
                            <td style={{ textAlign: 'right', fontWeight: 'bold', fontSize: 18, color: '#d0011b' }}>
                                {formatCurrency(order.total_money)}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
