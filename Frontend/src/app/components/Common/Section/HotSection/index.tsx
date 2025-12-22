'use client';

import { Children, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './HotSection.module.scss';

const cx = classNames.bind(styles);

interface HotSectionProps {
  id?: string;
  image: string;

  /** bật carousel loop + nút + auto-slide */
  scrollable?: boolean;
  itemsPerView?: number;

  children: ReactNode;
}

function HotSection({
  id,
  image,
  scrollable = false,
  itemsPerView = 5,
  children,
}: HotSectionProps) {
  const sliderRef = useRef<HTMLDivElement | null>(null);
  const itemWidthRef = useRef<number>(0);

  const itemsArray = useMemo(() => Children.toArray(children), [children]);
  const totalItems = itemsArray.length;
  const cloneCount = Math.min(itemsPerView, totalItems || 0);

  // index "thô" trong extended list (items + clones)
  const [index, setIndex] = useState(0);

  // đổi data/tab => quay về đầu
  useEffect(() => {
    setIndex(0);
    const container = sliderRef.current;
    if (container) container.scrollTo({ left: 0, behavior: 'auto' });
  }, [totalItems]);

  // dựng extended list: [real..., clone(0..cloneCount-1)] chỉ khi scrollable=true
  const extendedItems = useMemo(() => {
    if (!scrollable || totalItems === 0) return itemsArray;
    const clones = itemsArray.slice(0, cloneCount);
    return [...itemsArray, ...clones];
  }, [itemsArray, totalItems, cloneCount, scrollable]);

  // đo width 1 card sau khi render (để scroll theo 1 card)
  useEffect(() => {
    const container = sliderRef.current;
    if (!container) return;

    const firstItem = container.querySelector('.' + cx('sliderItem')) as HTMLElement | null;
    if (firstItem) itemWidthRef.current = firstItem.offsetWidth;
  }, [extendedItems]);

  const scrollToIndex = (rawIndex: number, behavior: ScrollBehavior) => {
    const container = sliderRef.current;
    if (!container) return;

    const step = itemWidthRef.current || container.clientWidth / itemsPerView;
    container.scrollTo({ left: rawIndex * step, behavior });
  };

  const handleNext = () => {
    if (!scrollable || totalItems === 0) return;

    const newIndex = index + 1;
    setIndex(newIndex);
    scrollToIndex(newIndex, 'smooth');

    // vào vùng clone -> reset về 0
    if (newIndex === totalItems) {
      setTimeout(() => {
        setIndex(0);
        scrollToIndex(0, 'auto');
      }, 320);
    }
  };

  const handlePrev = () => {
    if (!scrollable || totalItems === 0) return;

    // ở đầu -> nhảy sang vùng clone rồi kéo về cuối thật
    if (index === 0) {
      const lastRealIndex = totalItems - 1;
      const tempIndex = totalItems;

      setIndex(tempIndex);
      scrollToIndex(tempIndex, 'auto');

      requestAnimationFrame(() => {
        setIndex(lastRealIndex);
        scrollToIndex(lastRealIndex, 'smooth');
      });
      return;
    }

    const newIndex = index - 1;
    setIndex(newIndex);
    scrollToIndex(newIndex, 'smooth');
  };

  // AUTO SLIDE (chỉ khi scrollable=true)
  useEffect(() => {
    if (!scrollable || totalItems <= 1) return;

    const interval = setInterval(() => {
      setIndex((prev) => {
        const newIndex = prev + 1;

        scrollToIndex(newIndex, 'smooth');

        if (newIndex === totalItems) {
          setTimeout(() => {
            setIndex(0);
            scrollToIndex(0, 'auto');
          }, 320);
        }

        return newIndex;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, [scrollable, totalItems, itemsPerView]);

  return (
    <div id={id} className={cx('wrapper')}>
      <section className={cx('layout')}>
        {/* HEADER */}
        <div className={cx('header')}>
          <img src={image} alt="" />
        </div>

        {/* CONTENT: luôn kéo ngang (slider) */}
        <div className={cx('content')}>
          <div className={cx('sliderWrapper')}>
            {scrollable && totalItems > 1 && (
              <button
                type="button"
                className={cx('navBtn', 'navBtnPrev')}
                onClick={handlePrev}
              >
                <i className="fa-solid fa-chevron-left" />
              </button>
            )}

            <div className={cx('slider')} ref={sliderRef}>
              {(scrollable ? extendedItems : itemsArray).map((item, idx) => (
                <div key={idx} className={cx('sliderItem')}>
                  {item}
                </div>
              ))}
            </div>

            {scrollable && totalItems > 1 && (
              <button
                type="button"
                className={cx('navBtn', 'navBtnNext')}
                onClick={handleNext}
              >
                <i className="fa-solid fa-chevron-right" />
              </button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}

export default HotSection;
