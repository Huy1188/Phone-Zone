// src/app/components/Common/Pagination/index.tsx
"use client";

import classNames from "classnames/bind";
import styles from "./Pagination.module.scss";

const cx = classNames.bind(styles);

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null;

  const goToPage = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage) return;
    onPageChange(page);
  };

  const buildPages = () => {
    const pages: (number | "dots")[] = [];

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
      return pages;
    }

    pages.push(1);
    if (currentPage > 4) pages.push("dots");

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i++) pages.push(i);

    if (currentPage < totalPages - 3) pages.push("dots");
    pages.push(totalPages);

    return pages;
  };

  const pages = buildPages();

  return (
    <div className={cx("wrapper")}>
      <button
        className={cx("navBtn")}
        disabled={currentPage === 1}
        onClick={() => goToPage(currentPage - 1)}
      >
        &lt;
      </button>

      {pages.map((p, idx) =>
        p === "dots" ? (
          <span key={`dots-${idx}`} className={cx("dots")}>
            ...
          </span>
        ) : (
          <button
            key={p}
            className={cx("pageBtn", { active: p === currentPage })}
            onClick={() => goToPage(p)}
          >
            {p}
          </button>
        )
      )}

      <button
        className={cx("navBtn")}
        disabled={currentPage === totalPages}
        onClick={() => goToPage(currentPage + 1)}
      >
        &gt;
      </button>
    </div>
  );
}

export default Pagination;
