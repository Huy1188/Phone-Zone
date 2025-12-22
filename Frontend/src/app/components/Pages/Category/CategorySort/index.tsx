// src/app/components/pages/Category/CategorySort/index.tsx
import { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './CategorySort.module.scss';

const cx = classNames.bind(styles);

interface SortOption {
    label: string;
    value: string;
    icon: string;
}

interface Props {
    sortOptions: SortOption[];
    sortBy: string;
    onChangeSort: (value: string) => void;
}

function CategorySort({ sortOptions, sortBy, onChangeSort }: Props) {
    const [active, setActive] = useState(sortBy);
    return (
        <div className={cx('sort')}>
            <span className={cx('label')}>Sắp xếp theo</span>
            <div className={cx('select')}>
                {sortOptions.map((opt) => (
                    <button
                        key={opt.value}
                        value={opt.value}
                        className={cx('item', {
                            'item-active': opt.value === active,
                        })}
                        onClick={(e) => {
                            onChangeSort(opt.value);
                            setActive(opt.value);
                        }}
                    >
                        <i className={opt.icon}></i>
                        {opt.label}
                    </button>
                ))}
            </div>
        </div>
    );
}

export default CategorySort;
