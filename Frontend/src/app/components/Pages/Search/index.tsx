'use client';

import { useEffect, useMemo, useState } from 'react';
import classNames from 'classnames/bind';
import styles from './SearchPage.module.scss';

import Sortbar from '../../Common/Sortbar';
import Pagination from '../../Common/Pagination';
import SearchResultList from './SearchResultList';
import EmptySearch from './EmptySearch';

import { ALL_PRODUCTS } from '@/lib/catalog';
import { searchProducts } from '@/lib/search';

const cx = classNames.bind(styles);

export default function SearchPage({ keyword, page }: { keyword: string; page: number }) {
    const PAGE_SIZE = 10;

    const results = useMemo(() => searchProducts(ALL_PRODUCTS, keyword), [keyword]);

    const [sortedResults, setSortedResults] = useState(results);

    const [currentPage, setCurrentPage] = useState(page > 0 ? page : 1);
    useEffect(() => {
        setCurrentPage(page > 0 ? page : 1);
    }, [page, keyword]);

    useEffect(() => {
        setSortedResults(results);
    }, [results]);

    if (!keyword.trim()) return <EmptySearch mode="no-keyword" />;
    if (results.length === 0) return <EmptySearch mode="no-result" keyword={keyword} />;

    const totalPages = Math.max(1, Math.ceil(sortedResults.length / PAGE_SIZE));
    const safePage = Math.min(Math.max(1, currentPage), totalPages);

    const paginated = sortedResults.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE);

    return (
        <div className={cx('wrapper')}>
            <h1 className={cx('title')}>Tìm kiếm</h1>

            <div className={cx('meta')}>
                Từ khóa: <strong>{keyword}</strong> • {results.length} kết quả
            </div>

            <div className={cx('content')}>
                <Sortbar items={results} onSorted={setSortedResults} />

                <SearchResultList products={paginated} />

                <Pagination currentPage={safePage} totalPages={totalPages} onPageChange={setCurrentPage} />
            </div>
        </div>
    );
}
