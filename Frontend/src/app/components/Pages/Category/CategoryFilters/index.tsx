"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import classNames from "classnames/bind";
import styles from "./CategoryFilters.module.scss";

const cx = classNames.bind(styles);

interface Option {
  label: string;
  value: string;
}

interface SelectedFilters {
  brand: string[];
  priceRange: string[];
}

type SpecFilterGroup = { title: string; options: Option[] };

interface Props {
  selectedFilters: SelectedFilters;
  brandFilters: Option[];
  priceFilters: Option[];

  specFilterGroups: SpecFilterGroup[];
  selectedSpecs: Record<string, string[]>;
  onToggleSpec: (specTitle: string, value: string) => void;

  onToggleFilter: (key: keyof SelectedFilters, value: string) => void;
  onClearAll: () => void;

  // optional: bấm "Xem kết quả" -> đóng drawer / scroll
  onApply?: () => void;
}

type MenuKey = `brand` | `priceRange` | `spec:${string}` | null;

function CategoryFilters({
  selectedFilters,
  brandFilters,
  priceFilters,
  specFilterGroups,
  selectedSpecs,
  onToggleSpec,
  onToggleFilter,
  onClearAll,
  onApply,
}: Props) {
  const [openKey, setOpenKey] = useState<MenuKey>(null);
  const rootRef = useRef<HTMLDivElement | null>(null);

  // click outside -> đóng
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!rootRef.current) return;
      if (!rootRef.current.contains(e.target as Node)) setOpenKey(null);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const hasAny =
    selectedFilters.brand.length > 0 ||
    selectedFilters.priceRange.length > 0 ||
    Object.keys(selectedSpecs).length > 0;

  const specTop = useMemo(() => {
    // giới hạn số pill spec cho gọn (bạn có thể tăng)
    return specFilterGroups.slice(0, 6);
  }, [specFilterGroups]);

  const countSelectedForKey = (key: MenuKey) => {
    if (!key) return 0;
    if (key === "brand") return selectedFilters.brand.length;
    if (key === "priceRange") return selectedFilters.priceRange.length;
    if (key.startsWith("spec:")) {
      const title = key.replace("spec:", "");
      return (selectedSpecs[title] ?? []).length;
    }
    return 0;
  };

  const Pill = ({
    label,
    k,
  }: {
    label: string;
    k: MenuKey;
  }) => {
    const active = openKey === k;
    const cnt = countSelectedForKey(k);

    return (
      <button
        type="button"
        className={cx("pill", { active, chosen: cnt > 0 })}
        onClick={() => setOpenKey((prev) => (prev === k ? null : k))}
      >
        <span className={cx("pillText")}>{label}</span>
        {cnt > 0 && <span className={cx("pillCount")}>{cnt}</span>}
        <i className={cx("caret", "fa-solid fa-chevron-down", { up: active })} />
      </button>
    );
  };

  const Chip = ({
    active,
    label,
    onClick,
  }: {
    active: boolean;
    label: string;
    onClick: () => void;
  }) => (
    <button
      type="button"
      className={cx("chip", { active })}
      onClick={onClick}
    >
      {label}
    </button>
  );

  const renderMenu = () => {
    if (!openKey) return null;

    // BRAND
    if (openKey === "brand") {
      return (
        <div className={cx("menu")}>
          <div className={cx("menuChips")}>
            {brandFilters.map((o) => (
              <Chip
                key={o.value}
                label={o.label}
                active={selectedFilters.brand.includes(o.value)}
                onClick={() => onToggleFilter("brand", o.value)}
              />
            ))}
          </div>

          <div className={cx("menuActions")}>
            <button type="button" className={cx("btnGhost")} onClick={() => setOpenKey(null)}>
              Đóng
            </button>
            <button
              type="button"
              className={cx("btnPrimary")}
              onClick={() => {
                setOpenKey(null);
                onApply?.();
              }}
            >
              Xem kết quả
            </button>
          </div>
        </div>
      );
    }

    // PRICE
    if (openKey === "priceRange") {
      return (
        <div className={cx("menu")}>
          <div className={cx("menuChips")}>
            {priceFilters.map((o) => (
              <Chip
                key={o.value}
                label={o.label}
                active={selectedFilters.priceRange.includes(o.value)}
                onClick={() => onToggleFilter("priceRange", o.value)}
              />
            ))}
          </div>

          <div className={cx("menuActions")}>
            <button type="button" className={cx("btnGhost")} onClick={() => setOpenKey(null)}>
              Đóng
            </button>
            <button
              type="button"
              className={cx("btnPrimary")}
              onClick={() => {
                setOpenKey(null);
                onApply?.();
              }}
            >
              Xem kết quả
            </button>
          </div>
        </div>
      );
    }

    // SPEC
    if (openKey.startsWith("spec:")) {
      const title = openKey.replace("spec:", "");
      const group = specFilterGroups.find((g) => g.title === title);
      const picked = selectedSpecs[title] ?? [];

      if (!group) return null;

      return (
        <div className={cx("menu")}>
          <div className={cx("menuChips")}>
            {group.options.map((o) => (
              <Chip
                key={o.value}
                label={o.label}
                active={picked.includes(o.value)}
                onClick={() => onToggleSpec(title, o.value)}
              />
            ))}
          </div>

          <div className={cx("menuActions")}>
            <button type="button" className={cx("btnGhost")} onClick={() => setOpenKey(null)}>
              Đóng
            </button>
            <button
              type="button"
              className={cx("btnPrimary")}
              onClick={() => {
                setOpenKey(null);
                onApply?.();
              }}
            >
              Xem kết quả
            </button>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <div ref={rootRef} className={cx("wrap")}>
      <div className={cx("topRow")}>
        <div className={cx("leftTitle")}>
          <span className={cx("title")}>Chọn theo tiêu chí</span>
        </div>

        {hasAny && (
          <button type="button" className={cx("clear")} onClick={onClearAll}>
            Xóa tất cả
          </button>
        )}
      </div>

      <div className={cx("pillRow")}>
        <Pill label="Hãng" k="brand" />
        <Pill label="Mức giá" k="priceRange" />

        {specTop.map((g) => (
          <Pill key={g.title} label={g.title} k={`spec:${g.title}`} />
        ))}
      </div>

      <div className={cx("menuWrap")}>{renderMenu()}</div>
    </div>
  );
}

export default CategoryFilters;
