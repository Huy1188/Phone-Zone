"use client";

import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "../Navbar.module.scss";
import CategorySidebar from "@/app/components/Pages/Home/HeroSection/CategorySidebar";

const cx = classNames.bind(styles);

interface DropMenuProps {
  open: boolean;
  onClose: () => void;
}

export default function DropMenu({ open, onClose }: DropMenuProps) {
  const NAVBAR_H = 80; 
  const START_TOP = 177;

  const [menuTop, setMenuTop] = useState(START_TOP);
  const [isMobile, setIsMobile] = useState(false);

  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1023);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  
  useEffect(() => {
    if (!open || isMobile) return;

    const onScroll = () => {
      const next = Math.max(NAVBAR_H, START_TOP - window.scrollY);
      setMenuTop(next);
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [open, isMobile]);

  
  useEffect(() => {
    if (open && isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open, isMobile]);

  if (!open) return null;

  return (
    <>
      {}
      <div
        className={cx("nav-overlay")}
        onClick={onClose}
        aria-hidden="true"
      />

      {}
      <div
        className={cx("nav-panel", { mobile: isMobile, open })}
        role="dialog"
        aria-modal="true"
        aria-label="Danh mục"
        style={!isMobile ? { top: menuTop } : undefined}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={cx("nav-panel__inner")}>
          <div className={cx("nav-panel__sidebar")}>
            <CategorySidebar isDropdown />
          </div>
        </div>
      </div>
    </>
  );
}
