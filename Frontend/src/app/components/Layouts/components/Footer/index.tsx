/* src/app/components/Layouts/Footer/index.tsx */
"use client";

import classNames from "classnames/bind";
import styles from "./Footer.module.scss";
import Link from "next/link";

const cx = classNames.bind(styles);

const aboutLinks = [
  { label: "Giới thiệu", href: "#" },
  { label: "Tuyển dụng", href: "#" },
  { label: "Liên hệ", href: "#" },
];

const policyLinks = [
  { label: "Chính sách bảo hành", href: "#" },
  { label: "Chính sách giao hàng", href: "#" },
  { label: "Chính sách bảo mật", href: "#" },
];

const infoLinks = [
  { label: "Hệ thống cửa hàng", href: "#" },
  { label: "Hướng dẫn mua hàng", href: "#" },
  { label: "Hướng dẫn thanh toán", href: "#" },
  { label: "Hướng dẫn trả góp", href: "#" },
  { label: "Tra cứu địa chỉ bảo hành", href: "#" },
];

export default function Footer() {
  return (
    <footer className={cx("wrapper")}>
      <div className={cx("inner")}>
        {/* ===== DESKTOP/TABLET: GRID ===== */}
        <div className={cx("desktopTop")}>
          <div className={cx("col")}>
            <h4 className={cx("colTitle")}>Về PhoneZone</h4>
            <ul className={cx("linkList")}>
              {aboutLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={cx("col")}>
            <h4 className={cx("colTitle")}>Chính sách</h4>
            <ul className={cx("linkList")}>
              {policyLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={cx("col")}>
            <h4 className={cx("colTitle")}>Thông tin</h4>
            <ul className={cx("linkList")}>
              {infoLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className={cx("col")}>
            <h4 className={cx("colTitle")}>
              Tổng đài hỗ trợ <span className={cx("small")}>(8:00 - 21:00)</span>
            </h4>
            <ul className={cx("hotlineList")}>
              <li>
                Mua hàng: <a href="tel:19005301">1900.5301</a>
              </li>
              <li>
                Bảo hành: <a href="tel:19005325">1900.5325</a>
              </li>
              <li>
                Khiếu nại: <a href="tel:18006173">1800.6173</a>
              </li>
              <li>
                Email: <a href="mailto:cskh@phonezone.vn">cskh@phonezone.vn</a>
              </li>
            </ul>
          </div>

          <div className={cx("colWide")}>
            <div className={cx("shipping")}>
              <h4 className={cx("colTitle")}>Đơn vị vận chuyển</h4>
              <div className={cx("logoRow")}>
                <span className={cx("logoBox")}>GHN</span>
                <span className={cx("logoBox")}>GHTK</span>
                <span className={cx("logoBox")}>J&T</span>
                <span className={cx("logoBox")}>VNPost</span>
              </div>
            </div>

            <div className={cx("payment")}>
              <h4 className={cx("colTitle")}>Cách thức thanh toán</h4>
              <div className={cx("logoRow")}>
                <span className={cx("logoBox")}>Visa</span>
                <span className={cx("logoBox")}>MasterCard</span>
                <span className={cx("logoBox")}>Momo</span>
                <span className={cx("logoBox")}>ZaloPay</span>
              </div>
            </div>
          </div>
        </div>

        {/* ===== MOBILE: ACCORDION (GIỐNG ẢNH) ===== */}
        <div className={cx("mobileTop")}>
          <details className={cx("accordionItem")}>
            <summary className={cx("accordionHeader")}>Về PhoneZone</summary>
            <ul className={cx("linkList")}>
              {aboutLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </details>

          <details className={cx("accordionItem")}>
            <summary className={cx("accordionHeader")}>Chính sách</summary>
            <ul className={cx("linkList")}>
              {policyLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </details>

          <details className={cx("accordionItem")}>
            <summary className={cx("accordionHeader")}>Thông tin</summary>
            <ul className={cx("linkList")}>
              {infoLinks.map((item) => (
                <li key={item.label}>
                  <Link href={item.href}>{item.label}</Link>
                </li>
              ))}
            </ul>
          </details>

          <details className={cx("accordionItem")}>
            <summary className={cx("accordionHeader")}>
              Tổng đài hỗ trợ <span className={cx("small")}>(8:00 - 21:00)</span>
            </summary>
            <ul className={cx("hotlineList")}>
              <li>
                Mua hàng: <a href="tel:19005301">1900.5301</a>
              </li>
              <li>
                Bảo hành: <a href="tel:19005325">1900.5325</a>
              </li>
              <li>
                Khiếu nại: <a href="tel:18006173">1800.6173</a>
              </li>
              <li>
                Email: <a href="mailto:cskh@phonezone.vn">cskh@phonezone.vn</a>
              </li>
            </ul>
          </details>
        </div>

        {/* MIDDLE: social */}
        <div className={cx("socialRow")}>
          <span className={cx("socialLabel")}>Kết nối với chúng tôi</span>
          <div className={cx("socialIcons")}>
            <a href="#" aria-label="Facebook">
              <i className="fa-brands fa-facebook-f" />
            </a>
            <a href="#" aria-label="TikTok">
              <i className="fa-brands fa-tiktok" />
            </a>
            <a href="#" aria-label="YouTube">
              <i className="fa-brands fa-youtube" />
            </a>
            <a href="#" aria-label="Zalo">
              <i className="fa-solid fa-z" />
            </a>
          </div>
        </div>

        {/* BOTTOM */}
        <div className={cx("bottom")}>
          <span className={cx("copyright")}>
            © {new Date().getFullYear()} PhoneZone - Hệ thống máy tính & thiết bị công nghệ.
          </span>
          <div className={cx("certBox")}>
            <span className={cx("certFake")}>Đã thông báo Bộ Công Thương</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
