'use client';
import { useEffect, useState } from 'react';
import { getAllUsers, deleteUser } from '@/services/admin/userService';
import { User, Address } from '@/types/user';
import Link from 'next/link';
import styles from './UserManage.module.scss';

const UserManage = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const res: any = await getAllUsers();
            const list = res?.data?.users;
            setUsers(Array.isArray(list) ? list : []);
        } catch (error) {
            console.error(error);
            setUsers([]);
        } finally {
            setIsLoading(false);
        }
    };

    const onDeleteUser = async (id: number) => {
        if (!confirm('Bạn có chắc muốn xóa user này?')) return;
        try {
            let res: any = await deleteUser(id);
            if (res?.success) {
                alert('Xóa thành công!');
                fetchUsers();
            } else {
                alert(res.message);
            }
        } catch (e) {
            console.error(e);
        }
    };

    // 👇 HÀM XỬ LÝ HIỂN THỊ ĐỊA CHỈ TỪ BẢNG RIÊNG 👇
    const renderAddress = (addresses?: Address[]) => {
        // 1. Nếu không có địa chỉ nào -> Hiện "Chưa cập nhật"
        if (!addresses || addresses.length === 0) {
            return <span style={{ color: '#999', fontStyle: 'italic' }}>Chưa cập nhật</span>;
        }

        // 2. Tìm địa chỉ mặc định (is_default = 1 hoặc true)
        const defaultAddr = addresses.find((a) => a.is_default === true);

        // 3. Nếu không có mặc định thì lấy cái đầu tiên
        const addrToShow = defaultAddr || addresses[0];

        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
                {/* Nếu là mặc định thì hiện Badge xanh */}
                {addrToShow.is_default === true && <span className={styles.badgeDefault}>Default</span>}

                {/* Ghép chuỗi địa chỉ */}
                <span className={styles.addressText}>
                    {addrToShow.street ? `${addrToShow.street}, ` : ''}
                    {addrToShow.city}
                </span>
            </div>
        );
    };

    if (isLoading) return <div className="p-5">Đang tải dữ liệu...</div>;

    return (
        <div className={styles.container}>
            <div className={styles.cardBox}>
                <div className={styles.cardHeader}>
                    <h2>
                        <i className="fas fa-users"></i> Danh sách người dùng
                    </h2>
                    <Link href="/admin/users/create" className={styles.btnCreate}>
                        <i className="fas fa-plus"></i> Thêm thành viên
                    </Link>
                </div>

                <div className={styles.tableWrapper}>
                    <table className={styles.userTable}>
                        <thead>
                            <tr>
                                <th>Email</th>
                                <th>Họ</th>
                                <th>Tên</th>
                                <th>Địa chỉ (Mặc định)</th>
                                <th style={{ width: '120px', textAlign: 'center' }}>Hành động</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users &&
                                users.map((item) => (
                                    <tr key={item.user_id}>
                                        <td>
                                            <div className={styles.emailWrapper}>
                                                <i className="fas fa-envelope"></i> <span>{item.email}</span>
                                            </div>
                                        </td>
                                        <td>{item.last_name}</td>
                                        <td>
                                            <b>{item.first_name}</b>
                                        </td>
                                        <td>{renderAddress(item.addresses)}</td>

                                        <td className={styles.actions}>
                                            <Link href={`/admin/users/edit/${item.user_id}`} className={styles.btnEdit}>
                                                <i className="fas fa-edit"></i>
                                            </Link>
                                            <button
                                                className={styles.btnDelete}
                                                onClick={() => onDeleteUser(item.user_id)}
                                            >
                                                <i className="fas fa-trash"></i>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};
export default UserManage;
