import React, { useEffect, useId, useRef, useState } from "react";
import styles from "./CategoryFilterDrawer.module.scss";

type CategoryFilterDrawerProps = {
  open: boolean;
  title?: string;

  /** Gọi khi drawer đóng hẳn (sau animation) */
  onClose: () => void;

  /** Nút "Xem kết quả" */
  onApply: () => void;

  /** Nút "Đặt lại" (optional) */
  onReset?: () => void;

  /** Text của nút apply, ví dụ: "Xem 120 sản phẩm" */
  applyText?: string;

  /** Disable nút apply */
  disableApply?: boolean;

  /** Nội dung filter (CategoryFilters) */
  children: React.ReactNode;

  /** Thời gian animation đóng (ms) — phải khớp SCSS */
  closeDurationMs?: number;

  /** Ẩn nút reset nếu không cần */
  showReset?: boolean;
};

export default function CategoryFilterDrawer({
  open,
  title = "Bộ lọc",
  onClose,
  onApply,
  onReset,
  applyText = "Xem kết quả",
  disableApply = false,
  children,
  closeDurationMs = 180,
  showReset = true,
}: CategoryFilterDrawerProps) {
  const dialogId = useId();
  const [isClosing, setIsClosing] = useState(false);
  const closeTimerRef = useRef<number | null>(null);

  // Đóng có animation (không biến mất cái rụp)
  const requestClose = () => {
    if (isClosing) return;
    setIsClosing(true);

    if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    closeTimerRef.current = window.setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, closeDurationMs);
  };

  // Cleanup timer
  useEffect(() => {
    return () => {
      if (closeTimerRef.current) window.clearTimeout(closeTimerRef.current);
    };
  }, []);

  // Khóa scroll nền khi mở
  useEffect(() => {
    if (!open) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = prevOverflow;
    };
  }, [open]);

  // ESC để đóng
  useEffect(() => {
    if (!open) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, isClosing]);

  if (!open) return null;

  return (
    <div
      className={`${styles.overlay} ${isClosing ? styles.overlayClosing : ""}`}
      onClick={requestClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby={dialogId}
    >
      <div
        className={`${styles.drawer} ${isClosing ? styles.drawerClosing : ""}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.title} id={dialogId}>
            {title}
          </div>

          <button
            type="button"
            className={styles.closeBtn}
            onClick={requestClose}
            aria-label="Đóng bộ lọc"
          >
            Đóng
          </button>
        </div>

        <div className={styles.body}>{children}</div>

        <div className={styles.footer}>
          <div className={styles.footerInner}>
            {showReset && (
              <button
                type="button"
                className={styles.resetBtn}
                onClick={onReset}
                disabled={!onReset}
                title={!onReset ? "Chưa gắn handler onReset" : undefined}
              >
                Đặt lại
              </button>
            )}

            <button
              type="button"
              className={styles.applyBtn}
              onClick={onApply}
              disabled={disableApply}
            >
              {applyText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
