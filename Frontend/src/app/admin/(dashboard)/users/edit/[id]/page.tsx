'use client';
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getUserById, updateUser } from '@/services/admin/userService';
import styles from '@/app/components/Admin/Users/EditUser.module.scss';
import Link from 'next/link';


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

    
    const [formData, setFormData] = useState({
        user_id: '',
        email: '',
        first_name: '',
        last_name: '',
        phone: '',
        gender: '1',
        role_id: '2',
    });

    
    const [addressList, setAddressList] = useState<Address[]>([]);

    
    const [newAddress, setNewAddress] = useState({
        street: '',
        city: '',
        recipient_name: '',
        recipient_phone: '',
    });

    
    useEffect(() => {
        if (userId) fetchUserDetail(userId as string);
    }, [userId]);

    const fetchUserDetail = async (id: string | number) => {
        try {
            let res: any = await getUserById(id);
            const u = res?.data?.user;
            if (res?.success && u) {
                
                setFormData({
                    user_id: u.user_id,
                    email: u.email,
                    first_name: u.first_name || '',
                    last_name: u.last_name || '',
                    phone: u.phone || '',
                    gender: u.gender ? '1' : '0',
                    role_id: String(u.role_id),
                });
                
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

    
    const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    
    const handleAddressListChange = (index: number, field: string, value: string) => {
        let copyList = [...addressList];
        
        copyList[index][field] = value;
        setAddressList(copyList);
    };

    
    const handleNewAddressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewAddress((prev) => ({ ...prev, [name]: value }));
    };

    
    const handleSubmit = async () => {
        if (!formData.first_name || !formData.last_name) {
            alert('Vui lòng nhập đủ Họ và Tên!');
            return;
        }

        setIsLoading(true);
        try {
            
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

                
                addresses: addressesObj,

                
                

                new_street: newAddress.street,
                new_city: newAddress.city,
            };

            
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
                    {}
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

                    {}
                    <h3 className={styles.sectionTitle}>
                        <i className="fas fa-map-marker-alt"></i> Sổ địa chỉ ({addressList.length})
                    </h3>

                    {}
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

                    {}
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
