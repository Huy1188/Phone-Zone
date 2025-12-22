"use client";

import classNames from "classnames/bind";
import styles from "./CategorySubnav.module.scss";
import Link from "next/link";

const cx = classNames.bind(styles);

export interface CategorySubnavItem {
  key: string;
  label: string;
  href: string;
  iconClass: string; // class icon (fontawesome, remixicon, ...)
}

interface CategorySubnavProps {
  items: CategorySubnavItem[];
  activeKey?: string;
}

function CategorySubnav({ items, activeKey }: CategorySubnavProps) {
  return (
    <div className={cx("wrapper")}>
      <div className="grid">
        <div className={cx("inner")}>
          {items.map((item) => {
            const isActive = item.key === activeKey;

            return (
              <Link
                key={item.key}
                href={item.href}
                className={cx("item", { active: isActive })}
              >
                <div className={cx("icon-wrap")}>
                  <i className={item.iconClass} />
                </div>
                <span className={cx("label")}>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CategorySubnav;
