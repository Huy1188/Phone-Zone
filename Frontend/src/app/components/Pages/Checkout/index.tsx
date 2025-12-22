"use client";

import classNames from "classnames/bind";
import styles from "./Checkout.module.scss";
import CheckoutSteps from "./CheckoutSteps";
import CheckoutForm from "./CheckoutForm";
import OrderSummary from "./OrderSummary";
import { useCart } from "@/hooks/useCart";
import Link from "next/link";

const cx = classNames.bind(styles);

export default function CheckoutPage() {
  const { items, hydrated } = useCart();
  if (!hydrated) return null;
  if (items.length === 0) {
    return (
      <div className={cx("wrapper")}>
        <h1>Thanh toán</h1>
        <p>Giỏ hàng của bạn đang trống. Vui lòng thêm sản phẩm trước khi thanh toán.</p>
        <Link href="/cart" className={cx("back")}>Quay lại giỏ hàng</Link>
      </div>
    );
  }

  return (
    <div className={cx("wrapper")}>
      <h1 className={cx("title")}>Thanh toán</h1>

      <CheckoutSteps currentStep={2} />

      <div className={cx("layout")}>
        <div className={cx("left")}>
          <CheckoutForm />
        </div>

        <div className={cx("right")}>
          <OrderSummary />
        </div>
      </div>
    </div>
  );
}
