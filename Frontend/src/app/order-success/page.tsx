"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import classNames from "classnames/bind";
import styles from "./OrderSuccess.module.scss";

const cx = classNames.bind(styles);

export default function OrderSuccessPage() {
  const sp = useSearchParams();
  const orderId = sp.get("order_id");

  return (
    <div className={cx("wrap")}>
      <div className={cx("container")}>
        <div className={cx("card")}>
          <div className={cx("icon")}>
            <i className="fa-solid fa-check"></i>
          </div>

          <h1 className={cx("title")}>Đặt hàng thành công</h1>
          <p className={cx("subtitle")}>
            Cảm ơn bạn đã mua hàng tại <b>Phone Zone</b>. Chúng tôi sẽ liên hệ để xác nhận đơn hàng sớm nhất.
          </p>

          <div className={cx("info")}>
            <div className={cx("row")}>
              <span className={cx("label")}>Mã đơn hàng</span>
              <span className={cx("value")}>{orderId ?? "N/A"}</span>
            </div>

            <div className={cx("hint")}>
              Bạn có thể theo dõi trạng thái đơn trong mục{" "}
              <Link href="/account" className={cx("link")}>
                Tài khoản
              </Link>
              .
            </div>
          </div>

          <div className={cx("actions")}>
            <Link href="/" className={cx("btn", "primary")}>
              Tiếp tục mua sắm
            </Link>
            <Link href="/account" className={cx("btn", "outline")}>
              Xem tài khoản
            </Link>
          </div>

          <div className={cx("support")}>
            Cần hỗ trợ? Gọi <b>1900.5301</b> hoặc inbox fanpage.
          </div>
        </div>
      </div>
    </div>
  );
}
