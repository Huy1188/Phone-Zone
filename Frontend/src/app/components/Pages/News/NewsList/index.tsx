"use client";

import classNames from "classnames/bind";
import styles from "./NewsList.module.scss";
import { NewsItem } from "@/types/news";
import NewsCard from "../NewsCard";

const cx = classNames.bind(styles);

export default function NewsList({ items }: { items: NewsItem[] }) {
  return (
    <div className={cx("grid")}>
      {items.map((it) => (
        <NewsCard key={it.id} item={it} />
      ))}
    </div>
  );
}
