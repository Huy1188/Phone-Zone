"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import classNames from "classnames/bind";
import styles from "./SearchPage.module.scss";

import Sortbar from "../../Common/Sortbar";
import Pagination from "../../Common/Pagination";
import SearchResultList from "./SearchResultList";
import EmptySearch from "./EmptySearch";

import { fetchProductsPaged } from "@/services/products";
import type { Product } from "@/types/product";

const cx = classNames.bind(styles);

export default function SearchPage({
  keyword,
  page,
  sort,
}: {
  keyword: string;
  page: number;
  sort: string;
}) {
  const PAGE_SIZE = 10;
  const router = useRouter();

  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(0);

  const [currentPage, setCurrentPage] = useState(page > 0 ? page : 1);
  const [totalPages, setTotalPages] = useState(1);
  const [sortKey, setSortKey] = useState(sort || "newest");

  // sync page khi đổi url
  useEffect(() => {
    setCurrentPage(page > 0 ? page : 1);
  }, [page, keyword]);

  // sync sort khi đổi url
  useEffect(() => {
    setSortKey(sort || "newest");
  }, [sort]);

  // ✅ fetch đúng page từ DB + sort toàn DB
  useEffect(() => {
    const k = keyword.trim();
    if (!k) {
      setResults([]);
      setTotalPages(1);
      setTotal(0);
      return;
    }

    let cancelled = false;
    setLoading(true);

    (async () => {
      const { products, meta } = await fetchProductsPaged({
        q: k,
        page: currentPage,
        limit: PAGE_SIZE,
        sort: sortKey, // ✅ truyền sort lên BE
      });

      if (cancelled) return;

      setResults(products);
      setTotalPages(Math.max(1, Math.ceil(Number(meta.total) / Number(meta.limit))));
      setTotal(Number(meta.total) || 0);
    })()
      .catch(() => {
        if (!cancelled) {
          setResults([]);
          setTotalPages(1);
          setTotal(0);
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [keyword, currentPage, sortKey]); // ✅ thêm sortKey dependency

  if (!keyword.trim()) return <EmptySearch mode="no-keyword" />;
  if (!loading && results.length === 0) return <EmptySearch mode="no-result" keyword={keyword} />;

  // ✅ đổi page phải giữ sort
  const handlePageChange = (p: number) => {
    setCurrentPage(p);
    router.push(
      `/search?q=${encodeURIComponent(keyword)}&page=${p}&sort=${encodeURIComponent(sortKey)}`
    );
  };

  // ✅ đổi sort: reset về page=1 + push URL
  const handleSortChange = (nextSort: string) => {
    setSortKey(nextSort);
    setCurrentPage(1);
    router.push(
      `/search?q=${encodeURIComponent(keyword)}&page=1&sort=${encodeURIComponent(nextSort)}`
    );
  };

  return (
    <div className={cx("wrapper")}>
      <h1 className={cx("title")}>Tìm kiếm</h1>

      <div className={cx("meta")}>
        Từ khóa: <strong>{keyword}</strong> • {loading ? "Đang tải..." : `${total} kết quả`}
      </div>

      <div className={cx("content")}>
        {/* ✅ Sortbar phải chuyển sang server-side sort */}
        <Sortbar value={sortKey} onChange={handleSortChange} />

        {/* ✅ không cần sortedResults nữa vì DB đã sort */}
        <SearchResultList products={results} />

        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={handlePageChange}
        />
      </div>
    </div>
  );
}
