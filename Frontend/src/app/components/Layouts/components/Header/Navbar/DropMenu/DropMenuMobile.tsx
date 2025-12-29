"use client";
import { useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./DropMenuMobile.module.scss"; 
import CategorySidebar from "@/app/components/Pages/Home/HeroSection/CategorySidebar"; 

const cx = classNames.bind(styles);

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function DropMenuMobile({ open, onClose }: Props) {
  
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
      {}
      <div className={cx("dropOverlay")} onClick={onClose} aria-hidden="true" />

      {}
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
