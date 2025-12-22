"use client";

import { useEffect, useState } from "react";
import classNames from "classnames/bind";
import styles from "./HeroSection.module.scss";

import CategorySidebar from "./CategorySidebar";
import MainBanner from "./MainBanner";

const cx = classNames.bind(styles);

function HeroSection() {
  const [isDesktop, setIsDesktop] = useState(true);

  useEffect(() => {
    const check = () => setIsDesktop(window.innerWidth >= 1024);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className={cx("wrapper")}>
      <section className={cx("section1-layout")}>
        {isDesktop && <CategorySidebar />}
        <MainBanner />
      </section>
    </div>
  );
}

export default HeroSection;
