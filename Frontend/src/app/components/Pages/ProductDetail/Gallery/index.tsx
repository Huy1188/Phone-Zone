"use client";

import { useState, useEffect, useMemo } from "react";
import classNames from "classnames/bind";
import styles from "./Gallery.module.scss";

const cx = classNames.bind(styles);

interface Props {
  images: string[];
  extraThumbs?: string[];
}

export default function Gallery({ images, extraThumbs = [] }: Props) {
  const [activeImg, setActiveImg] = useState(images?.[0] ?? "");

  useEffect(() => {
    setActiveImg(images?.[0] ?? "");
  }, [images]);

  const thumbs = useMemo(() => {
    return Array.from(new Set([...(images ?? []), ...(extraThumbs ?? [])])).filter(Boolean);
  }, [images, extraThumbs]);

  if (!thumbs.length) return null;

  return (
    <div className={cx("gallery-wrapper")}>
      {/* Ảnh lớn */}
      <div className={cx("main-image")}>
        <img src={activeImg} alt="product" />
      </div>

      {/* Thumbnails */}
      <ul className={cx("thumbnails")}>
        {thumbs.map((url) => (
          <li
            key={url}
            className={cx({ active: url === activeImg })}
            onClick={() => setActiveImg(url)} // ✅ chỉ đổi ảnh
          >
            <img src={url} alt="thumb" />
          </li>
        ))}
      </ul>
    </div>
  );
}
