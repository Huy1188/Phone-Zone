import classNames from "classnames/bind";
import styles from "./NewsDetail.module.scss";
import { NewsItem } from "@/types/news";

const cx = classNames.bind(styles);

export default function NewsDetail({ item }: { item: NewsItem }) {
  return (
    <div className={cx("wrapper")}>
      <article className={cx("inner")}>
      <h1 className={cx("title")}>{item.title}</h1>

      <div className={cx("meta")}>
        {item.author && <span>Tác giả: {item.author}</span>}
        <span>{new Date(item.publishedAt).toLocaleDateString("vi-VN")}</span>
      </div>

      <div className={cx("thumb")}>
        <img src={item.thumbnail} alt={item.title} />
      </div>

      {/* content mock là HTML */}
      <div
        className={cx("content")}
        dangerouslySetInnerHTML={{ __html: item.content }}
      />
    </article>
    </div>
    
  );
}
