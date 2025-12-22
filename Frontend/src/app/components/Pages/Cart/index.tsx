"use client";

import classNames from "classnames/bind";
import styles from "./CartPage.module.scss";
import { useCart } from "@/hooks/useCart";    // ĐÚNG kiến trúc theo file cấu trúc
import CartItem from "./CartItem";
import CartSummary from "./CartSummary";
import EmptyCart from "./EmptyCart";
import CheckoutSteps from "../Checkout/CheckoutSteps";

const cx = classNames.bind(styles);

export default function CartPage() {
  const { items, hydrated } = useCart();
  if (!hydrated) return null;
  if (items.length === 0) {
    return <EmptyCart />;
  }

  return (
    <div className={cx("wrapper")}>
      <h1 className={cx("title")}>Giỏ hàng</h1>

      <CheckoutSteps currentStep={1} />

      <div className={cx("layout")}>
        <div className={cx("left")}>
          {items.map((item) => (
            <CartItem key={item.variantId} item={item} />
          ))}
        </div>

        <div className={cx("right")}>
          <CartSummary />
        </div>
      </div>
    </div>
  );
}
