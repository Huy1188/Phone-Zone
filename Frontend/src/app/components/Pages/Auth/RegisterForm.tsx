import styles from "./AuthLayout.module.scss";

export function RegisterForm() {
  return (
    <form className={styles.authForm}>
      <h1>TẠO TÀI KHOẢN</h1>

      <input type="text" placeholder="Họ và tên" required />
      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Mật khẩu" required />
      
      <button type="submit">Đăng ký</button>
    </form>
  );
}
