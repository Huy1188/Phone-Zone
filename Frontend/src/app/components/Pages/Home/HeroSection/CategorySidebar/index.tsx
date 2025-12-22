"use client";

import classNames from "classnames/bind";
import styles from "./CategorySidebar.module.scss";
import Link from "next/link";
import { useState, useEffect } from "react";
import { fetchCategories } from "@/services/categories";


const cx = classNames.bind(styles);

interface CategorySidebarProps {
  isDropdown?: boolean;
}

type SubLink = { label: string; href: string };
type SubGroup = { title: string; links: SubLink[] };
type SidebarItem = {
  icon: string;
  label: string;
  href: string;
  groups?: SubGroup[];
};

const STATIC_ITEMS: SidebarItem[] = [
  {
    icon: "fa-money-check",
    label: "Thu Cũ Đổi Mới",
    href: "/trade-in",
    groups: [
      {
        title: "Dịch vụ",
        links: [
          { label: "Thu cũ iPhone", href: "/trade-in/iphone" },
          { label: "Thu cũ Samsung", href: "/trade-in/samsung" },
          { label: "Định giá online", href: "/trade-in/price-check" },
        ],
      },
    ],
  },
  {
    icon: "fa-coins",
    label: "Hàng Cũ",
    href: "/products?condition=used",
    groups: [
      {
        title: "Danh mục",
        links: [
          { label: "Điện thoại cũ", href: "/products?category=phone&condition=used" },
          { label: "Tablet cũ", href: "/products?category=tablet&condition=used" },
        ],
      },
      {
        title: "Cam kết",
        links: [
          { label: "Bảo hành 6–12 tháng", href: "/used/warranty" },
          { label: "Test máy 7 ngày", href: "/used/return-policy" },
        ],
      },
    ],
  },
  {
    icon: "fa-gift",
    label: "Khuyến Mãi",
    href: "/promotions",
    groups: [
      {
        title: "Ưu đãi",
        links: [
          { label: "Flash Sale", href: "/promotions/flash-sale" },
          { label: "Deal cuối tuần", href: "/promotions/weekend" },
          { label: "Trả góp 0%", href: "/promotions/installment" },
        ],
      },
    ],
  },
  {
    icon: "fa-newspaper",
    label: "Tin Công Nghệ",
    href: "/news",
    groups: [
      {
        title: "Chuyên mục",
        links: [
          { label: "Tin mới", href: "/news/latest" },
          { label: "Đánh giá sản phẩm", href: "/news/review" },
          { label: "So sánh", href: "/news/compare" },
        ],
      },
    ],
  },
  {
    icon: "fa-screwdriver-wrench",
    label: "Sửa chữa – Bảo trì",
    href: "/service",
    groups: [
      {
        title: "Dịch vụ sửa chữa",
        links: [
          { label: "Thay pin", href: "/service/battery" },
          { label: "Thay màn hình", href: "/service/screen" },
          { label: "Sửa main", href: "/service/mainboard" },
        ],
      },
    ],
  },
  {
    icon: "fa-gift",
    label: "Dịch vụ & Thông tin khác",
    href: "/about",
    groups: [
      {
        title: "Hỗ trợ khách hàng",
        links: [
          { label: "Chính sách bảo hành", href: "/policy/warranty" },
          { label: "Hướng dẫn mua hàng", href: "/policy/buy-guide" },
          { label: "Liên hệ", href: "/contact" },
        ],
      },
    ],
  },
];


function CategorySidebar({ isDropdown }: CategorySidebarProps) {
  const [items, setItems] = useState<SidebarItem[]>(STATIC_ITEMS);
  const [loading, setLoading] = useState(false);

  const iconBySlug: Record<string, string> = {
  phone: "fa-mobile-screen",
  mobile: "fa-mobile-screen",
  tablet: "fa-tablet-screen-button",
  accessories: "fa-gamepad",
  laptop: "fa-laptop",
  pc: "fa-desktop",
  monitor: "fa-display",
  components: "fa-microchip",
};

const buildHrefFromSlug = (slug: string) => {
  // CÁCH 1 (giống nhiều dự án): đi trang category theo slug
  return `/category/${slug}`;

  // CÁCH 2 (nếu bạn đang list sản phẩm bằng query): bật cái này và tắt CÁCH 1
  // return `/products?category=${slug}`;
};

  useEffect(() => {
  let mounted = true;

  (async () => {
    try {
      setLoading(true);
      const categories = await fetchCategories();

      const categoryItems: SidebarItem[] = categories.map((c) => ({
        icon: iconBySlug[c.slug] ?? "fa-bars",
        label: c.name,
        href: buildHrefFromSlug(c.slug),
        // groups: ... // nếu sau này BE có filters/brands thì nhét vào đây
      }));

      if (mounted) setItems([...categoryItems, ...STATIC_ITEMS]);
    } catch (e) {
      // fail thì fallback static (không crash UI)
      if (mounted) setItems(STATIC_ITEMS);
    } finally {
      if (mounted) setLoading(false);
    }
  })();

  return () => {
    mounted = false;
  };
}, []);


  // desktop hover
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // mobile accordion
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 1023);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  const activeItem = activeIndex !== null ? items[activeIndex] : null;
  const isPanelOpen = !!activeItem?.groups?.length;

  const handleOpenDesktop = (idx: number) => setActiveIndex(idx);
  const handleCloseDesktop = () => setActiveIndex(null);

  const toggleMobile = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <div
      className={cx("section1", { mobile: isMobile && isDropdown })}
      onMouseLeave={!isMobile ? handleCloseDesktop : undefined}
    >
      {items.map((item, idx) => {
        const hasGroups = !!item.groups?.length;
        const isActive = idx === activeIndex; // desktop hover active
        const isOpen = idx === openIndex; // mobile accordion open

        // ===== MOBILE (GearVN accordion) =====
        if (isMobile && isDropdown) {
          return (
            <div key={item.label} className={cx("mb-item", { open: isOpen })}>
              <div className={cx("mb-row")}>
                {/* Text -> đi trang */}
                <Link href={item.href} className={cx("mb-link")}>
                  <i className={cx("fa-solid", item.icon, "sidebar-item_firsticon")} />
                  <span className={cx("sidebar-item__name")}>{item.label}</span>
                </Link>

                {/* Arrow -> toggle submenu */}
                {hasGroups && (
                  <button
                    type="button"
                    className={cx("mb-toggle")}
                    onClick={() => toggleMobile(idx)}
                    aria-expanded={isOpen}
                  >
                    <i className={cx("fa-solid fa-angle-down", { rotate: isOpen })} />
                  </button>
                )}
              </div>

              {/* Submenu nằm dưới item */}
              {hasGroups && (
                <div className={cx("mb-sub", { show: isOpen })}>
                  {item.groups!.map((group) => (
                    <div key={group.title} className={cx("mb-subGroup")}>
                      <div className={cx("mb-subTitle")}>{group.title}</div>
                      <div className={cx("mb-subLinks")}>
                        {group.links.map((l) => (
                          <Link key={l.href} href={l.href} className={cx("mb-subLink")}>
                            {l.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        }

        // ===== DESKTOP (giữ hover panel như cũ) =====
        return (
          <Link
            key={item.label}
            href={item.href}
            className={cx("sidebar-item", { active: isActive })}
            onMouseEnter={() => handleOpenDesktop(idx)}
            onFocus={() => handleOpenDesktop(idx)}
          >
            <i className={cx("fa-solid", item.icon, "sidebar-item_firsticon")} />
            <span className={cx("sidebar-item__name")}>{item.label}</span>
            <i className="fa-solid fa-angle-right" />

            {/* desktop: tam giác đỏ */}
            <div className={cx("sidebar-hover", { show: isActive && isPanelOpen })} />
          </Link>
        );
      })}

      {/* ===== DESKTOP PANEL (chỉ render khi KHÔNG phải mobile dropdown) ===== */}
      {!isMobile && (
        <div className={cx("section1-hover", { open: isPanelOpen })}>
          {activeItem?.groups?.map((group) => (
            <div key={group.title} className={cx("panel-group")}>
              <div className={cx("panel-title")}>{group.title}</div>
              <div className={cx("panel-links")}>
                {group.links.map((l) => (
                  <Link key={l.href} href={l.href} className={cx("panel-link")}>
                    {l.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategorySidebar;

