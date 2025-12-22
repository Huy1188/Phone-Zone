"use client";

import classNames from "classnames/bind";
import styles from "./SubNavbar.module.scss";
import Link from "next/link";

const cx = classNames.bind(styles);

const subnavItems = [
  {
    href: "/news",
    icon: "fa-solid fa-newspaper",
    label: "Tin công nghệ",
  },
  {
    href: "/repair",
    icon: "fa-solid fa-wrench",
    label: "Dịch vụ sửa chữa",
  },
  {
    href: "/home-service",
    icon: "fa-solid fa-money-check",
    label: "Dịch vụ kỹ thuật tại nhà",
  },
  {
    href: "/trade-in",
    icon: "fa-solid fa-coins",
    label: "Thu cũ đổi mới",
  },
  {
    href: "/warranty-check",
    icon: "fa-solid fa-shield",
    label: "Tra cứu bảo hành",
  },
];

function Subnav() {
  return (
    <div className={cx("header-subnav")}>
      <div className={cx("inner")}>
        <ul className={cx("header-subnav-list")}>
          {subnavItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className={cx("subnav__link")}>
                <i className={cx(item.icon, "subnav__icon")} />
                <span>{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default Subnav;
