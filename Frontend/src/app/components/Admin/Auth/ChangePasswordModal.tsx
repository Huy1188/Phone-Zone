'use client';
import { useState } from 'react';
import { changeAdminPassword } from '@/services/admin/authService'; // Nhớ import đúng
import styles from './ChangePassword.module.scss';

interface Props {
    isOpen: boolean;
    onClose: () => void;
}

const ChangePasswordModal = ({ isOpen, onClose }: Props) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async () => {
        // Validate cơ bản
        if (!currentPassword || !newPassword || !confirmPassword) {
            return alert('Vui lòng điền đầy đủ thông tin!');
        }
        if (newPassword !== confirmPassword) {
            return alert('Mật khẩu xác nhận không khớp!');
        }
        if (newPassword.length < 6) {
            return alert('Mật khẩu mới phải có ít nhất 6 ký tự!');
        }

        setLoading(true);
        try {
            // Gọi API
            let res: any = await changeAdminPassword({
                currentPassword,
                newPassword,
                confirmPassword,
            });

            if (res?.success) {
                alert('Đổi mật khẩu thành công!');
                handleClose(); // Đóng modal và reset form
            } else {
                alert(res.message); // Hiện lỗi từ backend (vd: Sai pass cũ)
            }
        } catch (e) {
            console.error(e);
            alert('Lỗi kết nối server');
        }
        setLoading(false);
    };

    const handleClose = () => {
        // Reset form khi đóng
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        onClose();
    };

    return (
        <div className={styles.overlay}>
            <div className={styles.modalBox}>
                <h3>
                    <i className="fas fa-key"></i> Đổi Mật Khẩu
                </h3>

                <div className={styles.formGroup}>
                    <label>Mật khẩu hiện tại</label>
                    <input
                        type="password"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        placeholder="Nhập mật khẩu cũ..."
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Mật khẩu mới</label>
                    <input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        placeholder="Nhập mật khẩu mới..."
                    />
                </div>

                <div className={styles.formGroup}>
                    <label>Xác nhận mật khẩu mới</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Nhập lại mật khẩu mới..."
                    />
                </div>

                <div className={styles.btnGroup}>
                    <button className={styles.btnSave} onClick={handleSubmit} disabled={loading}>
                        {loading ? 'Đang xử lý...' : 'Xác nhận'}
                    </button>
                    <button className={styles.btnCancel} onClick={handleClose}>
                        Hủy bỏ
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChangePasswordModal;
