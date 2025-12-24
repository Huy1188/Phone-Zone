'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getUserById, updateUser } from '@/services/admin/userService';
import styles from '@/app/components/Admin/Users/EditUser.module.scss';
import Link from 'next/link';

// Định nghĩa kiểu dữ liệu cho Address
interface Address {
    address_id: number;
    street: string;
    city: string;
    recipient_name: string;
    recipient_phone: string;
    is_default: boolean;
}

export default function EditUserPage() {
    const router = useRouter();
    const params = useParams();
    const userId = params?.id;

    const [isLoading, setIsLoading] = useState(false);

    // 1. State thông tin chính (User Info)
    const [formData, setFormData] = useState({
        user_id: '',
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        gender: '1',
        role_id: '2',
    });

    // 2. State danh sách địa chỉ cũ (Array)
    const [addressList, setAddressList] = useState<Address[]>([]);

    // 3. State địa chỉ mới (nếu muốn thêm)
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        recipient_name: '',
        recipient_phone: '',
    });

    // --- LOAD DỮ LIỆU ---
    useEffect(() => {
        if (userId) fetchUserDetail(userId as string);
    }, [userId]);

    const fetchUserDetail = async (id: string | number) => {
        try {
            let res: any = await getUserById(id);
            const u = res?.data?.user;
            if (res?.success && u) {
                // Fill thông tin user
                setFormData({
                    user_id: u.user_id,
                    email: u.email,
                    first_name: u.first_name || '',
                    last_name: u.last_name || '',
                    phone: u.phone || '',
                    gender: u.gender ? '1' : '0',
                    role_id: String(u.role_id),
                });
                // Fill danh sách địa chỉ (nếu có)
                if (u.addresses && u.addresses.length > 0) {
                    setAddressList(u.addresses);
                }
            } else {
                alert('Không tìm thấy người dùng!');
                router.push('/admin/users');
            }
        } catch (e) {
            console.error(e);
        }
    };

    // --- HANDLE CHANGE ---
    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Hàm xử lý thay đổi trong danh sách địa chỉ CŨ (Product Variant logic)
    const handleAddressListChange = (index: number, field: string, value: string) => {
        let copyList = [...addressList];
        // @ts-ignore
        copyList[index][field] = value;
        setAddressList(copyList);
    };

    // Hàm xử lý thay đổi địa chỉ MỚI
    const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({ ...prev, [name]: value }));
    };

    // --- SUBMIT ---
    const handleSubmit = async () => {
        if (!formData.first_name || !formData.last_name) {
            alert('Vui lòng nhập đủ Họ và Tên!');
            return;
        }

        setIsLoading(true);
        try {
            // ✅ Convert array -> object { [address_id]: {...} }
            const addressesObj = addressList.reduce((acc: any, addr) => {
                acc[addr.address_id] = {
                    recipient_name: addr.recipient_name,
                    recipient_phone: addr.recipient_phone,
                    street: addr.street,
                    city: addr.city,
                };
                return acc;
            }, {});

            const payload = {
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone: formData.phone || null,

                // backend putCRUD đang update các trường này
                addresses: addressesObj,

                // nếu muốn chọn default thì gửi selected_default_id (chưa có UI thì để null)
                // selected_default_id: ...

                new_street: newAddress.street,
                new_city: newAddress.city,
            };

            // ✅ updateUser(userId, payload)
            let res: any = await updateUser(userId as string, payload);

            if (res?.success) {
                alert('Cập nhật thành công!');
                router.push('/admin/users');
            } else {
                alert(res?.message || 'Có lỗi xảy ra');
            }
        } catch (e) {
            console.error(e);
            alert('Lỗi server.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>Cập nhật thông tin người dùng</h2>
            </div>

            <div className={styles.card}>
                <div className={styles.cardBody}>
                    {/* --- PHẦN 1: THÔNG TIN CHÍNH --- */}
                    <h3 className={styles.sectionTitle}>
                        <i className="fas fa-user-circle"></i> Thông tin chung
                    </h3>
                    <div className={styles.gridRow}>
                        <div className={styles.formGroup}>
                            <label>Email</label>
                            <input type="email" value={formData.email} disabled style={{ background: '#eee' }} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Họ</label>
                            <input
                                type="text"
                                name="last_name"
                                value={formData.last_name}
                                onChange={handleInfoChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Tên</label>
                            <input
                                type="text"
                                name="first_name"
                                value={formData.first_name}
                                onChange={handleInfoChange}
                            />
                        </div>
                        <div className={styles.formGroup}>
                            <label>SĐT Cá nhân</label>
                            <input type="text" name="phone" value={formData.phone} onChange={handleInfoChange} />
                        </div>
                        <div className={styles.formGroup}>
                            <label>Giới tính</label>
                            <select name="gender" value={formData.gender} onChange={handleInfoChange}>
                                <option value="1">Nam</option>
                                <option value="0">Nữ</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label>Vai trò</label>
                            <select name="role_id" value={formData.role_id} onChange={handleInfoChange}>
                                <option value="1">Admin</option>
                                <option value="2">User</option>
                            </select>
                        </div>
                    </div>

                    <div className={styles.divider}></div>

                    {/* --- PHẦN 2: QUẢN LÝ ĐỊA CHỈ --- */}
                    <h3 className={styles.sectionTitle}>
                        <i className="fas fa-map-marker-alt"></i> Sổ địa chỉ ({addressList.length})
                    </h3>

                    {/* ✅ Loop hiển thị các địa chỉ CŨ (Dùng class .addressItem) */}
                    {addressList.map((addr, index) => (
                        <div key={addr.address_id} className={styles.addressItem}>
                            <div className={styles.addressHeader}>
                                <span># Địa chỉ {index + 1}</span>
                                {addr.is_default && <span className={styles.defaultTag}>Mặc định</span>}
                            </div>
                            <div className={styles.gridRow}>
                                <div className={styles.formGroup}>
                                    <label>Đường/Thôn xóm</label>
                                    <input
                                        type="text"
                                        value={addr.street}
                                        onChange={(e) => handleAddressListChange(index, 'street', e.target.value)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Tỉnh/Thành phố</label>
                                    <input
                                        type="text"
                                        value={addr.city}
                                        onChange={(e) => handleAddressListChange(index, 'city', e.target.value)}
                                    />
                                </div>
                                <div className={styles.formGroup}>
                                    <label>Người nhận</label>
                                    <input
                                        type="text"
                                        value={addr.recipient_name}
                                        onChange={(e) =>
                                            handleAddressListChange(index, 'recipient_name', e.target.value)
                                        }
                                    />
                                </div>
                            </div>
                        </div>
                    ))}

                    {/* ✅ Form thêm địa chỉ MỚI (Dùng class .newAddressBox) */}
                    <div className={styles.newAddressBox}>
                        <div className={styles.boxTitle}>
                            <i className="fas fa-plus-circle"></i> Thêm địa chỉ mới
                        </div>
                        <div className={styles.gridRow}>
                            <div className={styles.formGroup}>
                                <label>Đường/Thôn xóm mới</label>
                                <input
                                    type="text"
                                    name="street"
                                    placeholder="Nhập địa chỉ mới..."
                                    value={newAddress.street}
                                    onChange={handleNewAddressChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Tỉnh/Thành phố</label>
                                <input
                                    type="text"
                                    name="city"
                                    placeholder="Hồ Chí Minh..."
                                    value={newAddress.city}
                                    onChange={handleNewAddressChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                <div className={styles.cardFooter}>
                    <Link href="/admin/users" className={styles.btnCancel}>
                        Hủy bỏ
                    </Link>
                    <button className={styles.btnSave} onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </button>
                </div>
            </div>
        </div>
    );
}
