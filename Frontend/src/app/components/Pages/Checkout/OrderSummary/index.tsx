"use client";

import classNames from "classnames/bind";
import styles from "./OrderSummary.module.scss";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/formatPrice";
import Link from "next/link";
import { resolveImageUrl } from "@/lib/resolveImageUrl";

const cx = classNames.bind(styles);

export default function OrderSummary() {
  const { items, totalPrice } = useCart();

  const shippingFee = totalPrice > 5000000 ? 0 : 30000;
  const total = totalPrice + shippingFee;

  return (
    <div className={cx("box")}>
      <h2>Đơn hàng</h2>

      <div className={cx("items")}>
        {items.map((item) => (
          <div key={item.variantId} className={cx("item")}>
            <div className={cx("left")}>
              <img
                src={resolveImageUrl(item.image)}
                alt={item.name}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/images/no-image.png";
                }}
              />
              <div>
                <div className={cx("name")}>{item.name}</div>
                <div className={cx("qty")}>SL: {item.quantity}</div>
              </div>
            </div>

            <div className={cx("right")}>
              {formatPrice(item.price * item.quantity)}
            </div>
          </div>
        ))}
      </div>

      <div className={cx("rows")}>
        <div className={cx("row")}>
          <span>Tạm tính</span>
          <strong>{formatPrice(totalPrice)}</strong>
        </div>
        <div className={cx("row")}>
          <span>Phí vận chuyển</span>
          <strong>{formatPrice(shippingFee)}</strong>
        </div>
        <div className={cx("row", "total")}>
          <span>Tổng cộng</span>
          <strong>{formatPrice(total)}</strong>
        </div>
      </div>

      <Link href="/cart" className={cx("back")}>
        Sửa giỏ hàng
      </Link>
    </div>
  );
}
