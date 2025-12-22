"use client";

import { useState, useEffect } from "react";
import classNames from "classnames/bind";
import styles from "./MainBanner.module.scss";
import Link from "next/link";

const cx = classNames.bind(styles);

const Gallery = [
  "https://file.hstatic.net/200000722513/file/gearvn-back-to-school-25-slider.png",
  "https://cdn.hstatic.net/files/200000722513/file/gearvn-laptop-gaming-slider-t10a.jpg",
  "https://file.hstatic.net/200000722513/file/gearvn-laptop-nvidia-rtx-50-series-slider.jpg",
  "https://cdn.hstatic.net/files/200000722513/file/gearvn-thu-cu-doi-moi-t10-slider.jpeg",
  "https://cdn.hstatic.net/files/200000722513/file/gearvn-man-hinh-t10-slider.jpg",
];

function MainBanner() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % Gallery.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className={cx("banner-wrapper")}>
      <div className={cx("section-banner")}>
        {/* MAIN SLIDE */}
        <div className={cx("section-banner1")}>
          <Link href="#">
            <img
              src={Gallery[index]}
              alt={`banner-${index}`}
              className={cx("fade")}
            />
          </Link>
        </div>

        {/* SIDE BANNERS */}
        <div className={cx("section-banner2")}>
          <Link href="#">
            <img
              src="https://file.hstatic.net/200000722513/file/gearvn-build-pc-slider-right-t8.png"
              alt=""
            />
          </Link>
          <Link href="#">
            <img
              src="https://file.hstatic.net/200000722513/file/gearvn-ban-phim-slider-right-t8.png"
              alt=""
            />
          </Link>
        </div>
      </div>

      {/* 4 SUBBANNERS */}
      <div className={cx("section-subbanner")}>
        <Link href="#" className={cx("section-subbanner__item")}>
          <img src="https://file.hstatic.net/200000722513/file/gearvn-gaming-gear-deal-hoi-sub-banner-t8.png" />
        </Link>
        <Link href="#" className={cx("section-subbanner__item")}>
          <img src="https://file.hstatic.net/200000722513/file/gearvn-man-hinh-sub-t8.png" />
        </Link>
        <Link href="#" className={cx("section-subbanner__item")}>
          <img src="https://file.hstatic.net/200000722513/file/gearvn-gaming-gear-sub-t8.png" />
        </Link>
        <Link href="#" className={cx("section-subbanner__item")}>
          <img src="https://file.hstatic.net/200000722513/file/gearvn-pc-amd-sub-t8.png" />
        </Link>
      </div>
    </div>
  );
}

export default MainBanner;
