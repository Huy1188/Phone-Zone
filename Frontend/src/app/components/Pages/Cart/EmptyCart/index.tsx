import Link from "next/link";
import classNames from "classnames/bind";
import styles from "./EmptyCart.module.scss";

const cx = classNames.bind(styles);

export default function EmptyCart() {
  return (
    <div className={cx("empty")}>
      <h2>Giỏ hàng trống</h2>
      <p>Hãy chọn sản phẩm bạn yêu thích!</p>

      <Link href="/" className={cx("btn")}>
        Tiếp tục mua sắm
      </Link>
    </div>
  );
}
