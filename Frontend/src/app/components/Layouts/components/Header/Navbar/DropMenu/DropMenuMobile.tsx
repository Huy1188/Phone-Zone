"use client";
import { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./DropMenuMobile.module.scss"; // hoặc file scss bạn đang để dropmenu
import CategorySidebar from "@/app/components/Pages/Home/HeroSection/CategorySidebar"; // giữ nguyên của bạn

const cx = classNames.bind(styles);

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function DropMenuMobile({ open, onClose }: Props) {
  // lock scroll body khi mở trên mobile
  useEffect(() => {
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 1023;
    if (open && isMobile) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* overlay */}
      <div className={cx("dropOverlay")} onClick={onClose} aria-hidden="true" />

      {/* panel */}
      <aside
        className={cx("dropPanel", { open })}
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cx("dropHeader")}>
          <span className={cx("dropTitle")}>Danh mục</span>
          <button className={cx("dropClose")} onClick={onClose} aria-label="Đóng menu">
            ✕
          </button>
        </div>

        <div className={cx("dropBody")}>
          <CategorySidebar isDropdown />
        </div>
      </aside>
    </>
  );
}
