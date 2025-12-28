"use client";

import { useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./page.module.scss";
import NewsList from "@/app/components/Pages/News/NewsList";
import Breadcrumb from "../components/Common/Breadcrumb";
import Pagination from "../components/Common/Pagination";
import { NewsItem } from "@/types/news";
import { getNewsList } from "@/services/news";

const cx = classNames.bind(styles);
const PAGE_SIZE = 6;

export default function NewsPage() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    (async () => {
      const data = await getNewsList();
      setItems(data);
    })();
  }, []);

  const totalItems = items.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);

  const paginatedNews = useMemo(
    () => items.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
    [items, safePage]
  );

  return (
    <div className={cx("container")}>
      <Breadcrumb items={[{ label: "Tất cả bài viết" }]} />
      <h1 className={cx("heading")}>Tin công nghệ</h1>

      <NewsList items={paginatedNews} />

      <Pagination
        currentPage={safePage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
