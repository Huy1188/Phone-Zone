'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createNewUser } from '@/services/admin/userService';
import styles from '@/app/components/Admin/Users/CreateUser.module.scss'; // Nhớ sửa đường dẫn này nếu file scss nằm chỗ khác
import Link from 'next/link';

export default function CreateUserPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone: '',
        gender: '1', // Mặc định chọn Nam cho đỡ bị null
        role_id: '2', // Mặc định User
    });

    const handleOnChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        // Validate cơ bản
        if (!formData.email || !formData.password || !formData.first_name || !formData.last_name) {
            alert('Vui lòng điền đầy đủ các trường có dấu (*)!');
            return;
        }

        setIsLoading(true);
        try {
            // Chuẩn bị dữ liệu gửi đi
            const payload = {
                email: formData.email,
                password: formData.password,
                first_name: formData.first_name,
                last_name: formData.last_name,
                phone: formData.phone || null,
                role_id: Number(formData.role_id),
                // Chuyển đổi giới tính sang boolean
                gender: formData.gender === '1',
            };

            const res: any = await createNewUser(payload);

            if (res?.success) {
                alert('Tạo người dùng thành công!');
                router.push('/admin/users');
            } else {
                alert(res?.message || 'Có lỗi xảy ra');
            }
        } catch (e: any) {
            console.error('API error:', e.response?.data);
            alert(e.response?.data?.message || 'Lỗi Server');
            console.log('API error:', e?.response?.data);

            console.log(
                'Unique fields:',
                e?.response?.data?.errors?.map((er: any) => ({ path: er.path, value: er.value })),
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className={styles.wrapper}>
            <div className={styles.header}>
                <h2 className={styles.title}>Thêm người dùng mới</h2>
            </div>

            <div className={styles.card}>
                <div className={styles.cardBody}>
                    {/* PHẦN 1: THÔNG TIN TÀI KHOẢN */}
                    <h3 className={styles.sectionTitle}>
                        <i className="fas fa-shield-alt"></i> Thông tin tài khoản
                    </h3>
                    <div className={styles.gridRow}>
                        <div className={styles.formGroup}>
                            <label>
                                Email đăng nhập <span className={styles.required}>*</span>
                            </label>
                            <div className={styles.inputIcon}>
                                <i className="fas fa-envelope"></i>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleOnChange}
                                    placeholder="example@gmail.com"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>
                                Mật khẩu <span className={styles.required}>*</span>
                            </label>
                            <div className={styles.inputIcon}>
                                <i className="fas fa-lock"></i>
                                <input
                                    type="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleOnChange}
                                    placeholder="••••••••"
                                />
                            </div>
                        </div>

                        <div className={styles.formGroup}>
                            <label>Vai trò</label>
                            <div className={styles.inputIcon}>
                                <i className="fas fa-user-tag"></i>
                                <select name="role_id" value={formData.role_id} onChange={handleOnChange}>
                                    <option value="1">Quản trị viên (Admin)</option>
                                    <option value="2">Khách hàng (User)</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div className={styles.divider}></div>

                    {/* PHẦN 2: THÔNG TIN CÁ NHÂN */}
                    <h3 className={styles.sectionTitle}>
                        <i className="fas fa-id-card"></i> Thông tin cá nhân
                    </h3>
                    <div className={styles.gridRow}>
                        <div className={styles.formGroup}>
                            <label>
                                Họ<span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                name="last_name"
                                className={styles.inputControl}
                                value={formData.last_name}
                                onChange={handleOnChange}
                                placeholder="Ví dụ: Nguyễn"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>
                                Tên <span className={styles.required}>*</span>
                            </label>
                            <input
                                type="text"
                                name="first_name"
                                className={styles.inputControl}
                                value={formData.first_name}
                                onChange={handleOnChange}
                                placeholder="Ví dụ: Văn A"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Số điện thoại</label>
                            <input
                                type="text"
                                name="phone"
                                className={styles.inputControl}
                                value={formData.phone}
                                onChange={handleOnChange}
                                placeholder="09xxxxxxxxx"
                            />
                        </div>

                        <div className={styles.formGroup}>
                            <label>Giới tính</label>
                            <select
                                name="gender"
                                className={styles.inputControl}
                                value={formData.gender}
                                onChange={handleOnChange}
                            >
                                <option value="1">Nam</option>
                                <option value="0">Nữ</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className={styles.cardFooter}>
                    <Link href="/admin/users" className={styles.btnCancel}>
                        <i className="fas fa-times"></i> Hủy bỏ
                    </Link>
                    <button className={styles.btnSave} onClick={handleSubmit} disabled={isLoading}>
                        {isLoading ? (
                            <>
                                <i className="fas fa-spinner fa-spin"></i> Đang lưu...
                            </>
                        ) : (
                            <>
                                <i className="fas fa-save"></i> Lưu lại
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
