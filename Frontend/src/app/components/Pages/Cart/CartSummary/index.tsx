"use client";

import classNames from "classnames/bind";
import styles from "./CartSummary.module.scss";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/formatPrice";
import Link from "next/link";

const cx = classNames.bind(styles);

export default function CartSummary() {
  const { totalPrice } = useCart();

  return (
    <div className={cx("summary")}>
      <h3>Tóm tắt</h3>

      <div className={cx("row")}>
        <span>Tạm tính</span>
        <strong>{formatPrice(totalPrice)}</strong>
      </div>

      <Link href="/checkout" className={cx("checkout")}>
        Tiến hành đặt hàng
      </Link>
    </div>
  );
}
