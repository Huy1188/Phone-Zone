"use client";

import Link from "next/link";
import classNames from "classnames/bind";
import styles from "./NewsCard.module.scss";
import { NewsItem } from "@/types/news";

const cx = classNames.bind(styles);

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className={cx("card")}>
      <Link href={`/news/${item.slug}`} className={cx("thumb")}>
        {/* nếu bạn đang dùng next/image thì thay bằng <Image /> */}
        <img src={item.thumbnail} alt={item.title} />
      </Link>

      <div className={cx("body")}>
        <div className={cx("meta")}>
          {item.category && <span className={cx("category")}>{item.category}</span>}
          <span className={cx("date")}>{new Date(item.publishedAt).toLocaleDateString("vi-VN")}</span>
        </div>

        <Link href={`/news/${item.slug}`} className={cx("title")}>
          {item.title}
        </Link>

        <p className={cx("excerpt")}>{item.excerpt}</p>
      </div>
    </article>
  );
}
