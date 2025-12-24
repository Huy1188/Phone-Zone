"use client";

import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./CheckoutForm/CheckoutForm.module.scss"; // ok nếu AddressPickerModal nằm cùng folder Pages/Checkout
import { getMyAddresses, type Address } from "@/services/address";

const cx = classNames.bind(styles);

type Props = {
  open: boolean;
  onClose: () => void;
  onSelect: (addr: Address) => void;
  selectedId?: number | null;
};

export default function AddressPickerModal({ open, onClose, onSelect, selectedId }: Props) {
  const [loading, setLoading] = useState(false);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;

    (async () => {
      try {
        setLoading(true);
        setErr(null);
        const res = await getMyAddresses();
        setAddresses(res.addresses || []);
      } catch (e: any) {
        setErr(e?.message || "Không tải được địa chỉ");
      } finally {
        setLoading(false);
      }
    })();
  }, [open]);

  if (!open) return null;

  return (
    <div className={cx("modalOverlay")} onClick={onClose}>
      <div className={cx("modal")} onClick={(e) => e.stopPropagation()}>
        <div className={cx("modalHead")}>
          <div className={cx("modalTitle")}>Chọn địa chỉ giao hàng</div>
          <button type="button" className={cx("modalClose")} onClick={onClose}>
            ✕
          </button>
        </div>

        <div className={cx("modalBody")}>
          {loading && <div className={cx("card")}>Đang tải địa chỉ...</div>}
          {!loading && err && <div className={cx("card")}>{err}</div>}

          {!loading && !err && addresses.length === 0 && (
            <div className={cx("card")}>
              Bạn chưa có địa chỉ nào. Vui lòng thêm địa chỉ ở trang <b>Tài khoản &gt; Sổ địa chỉ</b>.
            </div>
          )}

          {!loading && !err && addresses.length > 0 && (
            <div className={cx("addrPickList")}>
              {addresses.map((a) => {
                const active = a.address_id === selectedId;
                return (
                  <button
                    key={a.address_id}
                    type="button"
                    className={cx("addrPickItem", { active })}
                    onClick={() => onSelect(a)}
                  >
                    <div className={cx("addrPickTop")}>
                      <div className={cx("addrPickName")}>
                        {a.recipient_name} — {a.recipient_phone}
                      </div>
                      {a.is_default && <span className={cx("badge", "badgeDone")}>Mặc định</span>}
                    </div>
                    <div className={cx("addrPickText")}>
                      {a.street}, {a.city}
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>

        <div className={cx("modalFoot")}>
          <button className={cx("btnOutline")} type="button" onClick={onClose}>
            Đóng
          </button>
          <a className={cx("btnOutline")} href="/account?tab=address">
            Quản lý địa chỉ
          </a>
        </div>
      </div>
    </div>
  );
}
