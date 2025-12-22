import classNames from 'classnames/bind';
import styles from './CategorySubList.module.scss';
import Link from 'next/link';

const cx = classNames.bind(styles);

export interface CategorySubListItem {
    label: string;
    value: string;
    image: string;
}

interface CategorySubListProps {
    items: CategorySubListItem[];
    title?: string;
    activeKey?: boolean;
}

function CategorySubList({ items, title, activeKey }: CategorySubListProps) {
    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <h1 className={cx('header')}>{title}</h1>
                <div className={cx('content')}>
                    {items.map((item) => (
                        <Link
                            key={item.label}
                            href={`/products?brand=${encodeURIComponent(item.value)}`}
                            className={cx('item')}
                            style={!activeKey ? {backgroundColor: 'white'} : {backgroundColor:'#f7f7f7'}}
                        >
                            <img src={item.image} alt=""/>
                            {activeKey && <span className={cx('label')}>{item.label}</span>}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default CategorySubList;
