import Link from "next/link";
import styles from "./AuthLayout.module.scss";

export function LoginForm() {
  return (
    <form className={styles.authForm}>
      <h1>ĐĂNG NHẬP</h1>

      <input type="email" placeholder="Email" required />
      <input type="password" placeholder="Mật khẩu" required />

      <Link href="#">Quên mật khẩu?</Link>
      <span>Bạn chưa có tài khoản,</span>
      <Link href="#">Đăng ký ngay</Link>
      <button type="submit">Đăng nhập</button>
    </form>
  );
}
