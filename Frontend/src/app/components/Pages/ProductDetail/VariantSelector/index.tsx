"use client";

import classNames from "classnames/bind";
import styles from "./VariantSelector.module.scss";
import type { ProductVariant } from "@/types/product";

const cx = classNames.bind(styles);

type Props = {
  variants: ProductVariant[];

  selColor: string | null;
  selRam: string | null;
  selRom: string | null;

  onChangeColor: (v: string | null) => void;
  onChangeRam: (v: string | null) => void;
  onChangeRom: (v: string | null) => void;
};

function uniq(values: (string | null | undefined)[]) {
  return Array.from(new Set(values.map((v) => (v ?? "").trim()).filter(Boolean)));
}

export default function VariantSelector({
  variants,
  selColor,
  selRam,
  selRom,
  onChangeColor,
  onChangeRam,
  onChangeRom,
}: Props) {
  if (!variants?.length) return null;

  const colors = uniq(variants.map((v) => v.color));
  const rams = uniq(variants.map((v) => v.ram));
  const roms = uniq(variants.map((v) => v.rom));

  // ✅ disabled nếu KHÔNG tồn tại variant phù hợp với các lựa chọn còn lại
  // + (tuỳ bạn) chặn luôn variant hết hàng: stock === 0
  const hasVariant = (check: Partial<{ color: string; ram: string; rom: string }>) => {
    return variants.some((v) => {
      const okColor = !check.color || (v.color ?? "") === check.color;
      const okRam = !check.ram || (v.ram ?? "") === check.ram;
      const okRom = !check.rom || (v.rom ?? "") === check.rom;

      const okStock = typeof v.stock !== "number" ? true : v.stock > 0; // ✅ nếu muốn disable hết hàng
      return okColor && okRam && okRom && okStock;
    });
  };

  const isColorDisabled = (c: string) =>
    !hasVariant({ color: c, ram: selRam ?? undefined, rom: selRom ?? undefined });

  const isRamDisabled = (r: string) =>
    !hasVariant({ ram: r, color: selColor ?? undefined, rom: selRom ?? undefined });

  const isRomDisabled = (m: string) =>
    !hasVariant({ rom: m, color: selColor ?? undefined, ram: selRam ?? undefined });

  return (
    <div className={cx("wrap")}>
      <div className={cx("title")}>Chọn cấu hình</div>

      {colors.length > 0 && (
        <div className={cx("row")}>
          <div className={cx("label")}>Màu:</div>
          <div className={cx("options")}>
            {colors.map((c) => (
              <button
                key={c}
                type="button"
                className={cx("opt", { active: selColor === c })}
                disabled={isColorDisabled(c)}
                onClick={() => onChangeColor(selColor === c ? null : c)} // click lại để bỏ chọn
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      )}

      {rams.length > 0 && (
        <div className={cx("row")}>
          <div className={cx("label")}>RAM:</div>
          <div className={cx("options")}>
            {rams.map((r) => (
              <button
                key={r}
                type="button"
                className={cx("opt", { active: selRam === r })}
                disabled={isRamDisabled(r)}
                onClick={() => onChangeRam(selRam === r ? null : r)}
              >
                {r}
              </button>
            ))}
          </div>
        </div>
      )}

      {roms.length > 0 && (
        <div className={cx("row")}>
          <div className={cx("label")}>Bộ nhớ:</div>
          <div className={cx("options")}>
            {roms.map((m) => (
              <button
                key={m}
                type="button"
                className={cx("opt", { active: selRom === m })}
                disabled={isRomDisabled(m)}
                onClick={() => onChangeRom(selRom === m ? null : m)}
              >
                {m}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
