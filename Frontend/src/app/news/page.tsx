'use client';

import { useState, useMemo } from 'react';
import classNames from 'classnames/bind';
import styles from './page.module.scss';
import NewsList from '@/app/components/Pages/News/NewsList';
import Breadcrumb from '../components/Common/Breadcrumb';
import Pagination from '../components/Common/Pagination';
import { NEWS } from '@/app/data/newsData';

const cx = classNames.bind(styles);
const PAGE_SIZE = 6;


export default function NewsPage() {

    const [currentPage, setCurrentPage] = useState(1);

    const totalItems = NEWS.length
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);

    const paginatedNews = useMemo(
            () => NEWS.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
            [NEWS, safePage],
        );
    return (
        <div className={cx('container')}>
            <Breadcrumb items={[{ label: 'Tất cả bài viết' }]} />

            <h1 className={cx('heading')}>Tin công nghệ</h1>
            <NewsList items={paginatedNews} />
            {/* nếu có Pagination component thì đặt ở đây */}

            <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
        </div>
    );
}
