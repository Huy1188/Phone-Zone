// src/app/components/pages/Category/CategoryHero/index.tsx
import classNames from "classnames/bind";
import styles from "./CategoryHero.module.scss";
import Link from 'next/link';
const cx = classNames.bind(styles);

interface CategoryHeroProps {
  title: string;
}

function CategoryHero({ title }: CategoryHeroProps) {
  return (
    <section className={cx("hero")}>
      <div className="grid">
        <nav className={cx("breadcrumb")}>
          <Link href="/">
            <i className="fa-solid fa-house"></i>
            Trang chủ
          </Link>
          <span className={cx("separator")}>/</span>
          <span className={cx("current")}>{title}</span>
        </nav>
      </div>
    </section>
  );
}

export default CategoryHero;
