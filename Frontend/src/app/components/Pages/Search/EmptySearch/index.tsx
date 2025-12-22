import Link from "next/link";
import classNames from "classnames/bind";
import styles from "./EmptySearch.module.scss";

const cx = classNames.bind(styles);

export default function EmptySearch({
  mode,
  keyword,
}: {
  mode: "no-keyword" | "no-result";
  keyword?: string;
}) {
  return (
    <div className={cx("empty")}>
      {mode === "no-keyword" ? (
        <>
          <h2>Nhập từ khóa để tìm kiếm</h2>
          <p>Ví dụ: iPhone 15, Samsung, laptop gaming...</p>
        </>
      ) : (
        <>
          <h2>Không tìm thấy kết quả</h2>
          <p>
            Không có sản phẩm phù hợp với: <strong>{keyword}</strong>
          </p>
        </>
      )}
      <Link href="/" className={cx("btn")}>
        Về trang chủ
      </Link>
    </div>
  );
}
