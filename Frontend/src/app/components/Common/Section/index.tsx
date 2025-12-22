// src/app/components/Common/Section/index.tsx
'use client';

import { Children, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './Section.module.scss';
import Link from 'next/link';

const cx = classNames.bind(styles);

export interface TabItem {
    key: string;
    label: string;
}

interface SectionProps {
    id?: string;
    title: string;
    badgeIcon?: string;
    badgeText?: string;
    tabs: TabItem[];
    activeKey: string;
    onTabChange: (key: string) => void;
    viewAllHref?: string;

    /** bật carousel 5 card, bước 1 card */
    scrollable?: boolean;
    itemsPerView?: number;

    children: ReactNode;
}

function Section({
    id,
    title,
    badgeIcon = 'fa-solid fa-truck',
    badgeText,
    tabs,
    activeKey,
    onTabChange,
    viewAllHref,
    scrollable = false,
    itemsPerView = 5,
    children,
}: SectionProps) {
    const sliderRef = useRef<HTMLDivElement | null>(null);
    const itemWidthRef = useRef<number>(0);

    const itemsArray = useMemo(() => Children.toArray(children), [children]);
    const totalItems = itemsArray.length;
    const cloneCount = Math.min(itemsPerView, totalItems || 0);

    // index "thô" trong extended list (items + clones)
    const [index, setIndex] = useState(0);

    // đổi tab => quay về đầu
    useEffect(() => {
        setIndex(0);
        if (!scrollable) return;
        const container = sliderRef.current;
        if (container) {
            container.scrollTo({ left: 0, behavior: 'auto' });
        }
    }, [activeKey, totalItems, scrollable]);

    // dựng extended list: [real..., clone(0..cloneCount-1)]
    const extendedItems = useMemo(() => {
        if (!scrollable || totalItems === 0) return itemsArray;
        const clones = itemsArray.slice(0, cloneCount);
        return [...itemsArray, ...clones];
    }, [itemsArray, totalItems, cloneCount, scrollable]);

    // đo width 1 card sau khi render
    useEffect(() => {
        if (!scrollable) return;
        const container = sliderRef.current;
        if (!container) return;
        const firstItem = container.querySelector('.' + cx('sliderItem')) as HTMLElement | null;
        if (firstItem) {
            itemWidthRef.current = firstItem.offsetWidth;
        }
    }, [extendedItems, scrollable]);

    const scrollToIndex = (rawIndex: number, behavior: ScrollBehavior) => {
        const container = sliderRef.current;
        if (!container) return;

        const step = itemWidthRef.current || container.clientWidth / itemsPerView;
        container.scrollTo({
            left: rawIndex * step,
            behavior,
        });
    };

    const handleNext = () => {
        if (!scrollable || totalItems === 0) return;
        const newIndex = index + 1;

        setIndex(newIndex);
        scrollToIndex(newIndex, 'smooth');

        // nếu đã trượt vào vùng clone (>= totalItems) -> reset lại index thực sự = 0
        if (newIndex === totalItems) {
            // chờ animation smooth (~300ms) rồi teleport về 0 không animation
            setTimeout(() => {
                setIndex(0);
                scrollToIndex(0, 'auto');
            }, 320);
        }
    };

    const handlePrev = () => {
        if (!scrollable || totalItems === 0) return;

        // nếu đang ở đầu -> nhảy tạm sang vùng clone cuối rồi kéo ngược về cuối thật
        if (index === 0) {
            const lastRealIndex = totalItems - 1;
            const tempIndex = totalItems; // vùng clone đầu tiên

            setIndex(tempIndex);
            scrollToIndex(tempIndex, 'auto'); // nhảy ngay (không animation)

            // sau 1 tick, kéo ngược về lastRealIndex có animation → nhìn như đi sang trái
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

    // === AUTO SLIDE ===
    useEffect(() => {
    if (!scrollable || totalItems <= 1) return;

    const interval = setInterval(() => {
        setIndex((prev) => {
            const newIndex = prev + 1;

            // trượt sang phải 1 card
            scrollToIndex(newIndex, 'smooth');

            // nếu đã vào vùng clone -> reset về 0 sau khi animation xong
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
                    <div className={cx('item')}>
                        <h2 className={cx('title')}>{title}</h2>

                        {badgeText && (
                            <h3 className={cx('badge')}>
                                <i className={badgeIcon}></i>
                                {badgeText}
                            </h3>
                        )}
                    </div>

                    <div className={cx('item')}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.key}
                                className={cx('tab-item', {
                                    active: tab.key === activeKey,
                                })}
                                onClick={() => onTabChange(tab.key)}
                            >
                                {tab.label}
                            </button>
                        ))}

                        {viewAllHref && (
                            <span>
                                <Link href={viewAllHref} className={cx('viewAllButton')}>
                                    Xem tất cả
                                </Link>
                            </span>
                        )}
                    </div>
                </div>

                {/* CONTENT */}
                <div className={cx('content')}>
                    {scrollable ? (
                        <div className={cx('sliderWrapper')}>
                            {totalItems > 1 && (
                                <button type="button" className={cx('navBtn', 'navBtnPrev')} onClick={handlePrev}>
                                    <i className="fa-solid fa-chevron-left" />
                                </button>
                            )}

                            <div className={cx('slider')} ref={sliderRef}>
                                {extendedItems.map((item, idx) => (
                                    <div key={idx} className={cx('sliderItem')}>
                                        {item}
                                    </div>
                                ))}
                            </div>

                            {totalItems > 1 && (
                                <button type="button" className={cx('navBtn', 'navBtnNext')} onClick={handleNext}>
                                    <i className="fa-solid fa-chevron-right" />
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className={cx('slider')}>
                            {itemsArray.map((item, idx) => (
                                <div key={idx} className={cx('sliderItem')}>
                                    {item}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default Section;
