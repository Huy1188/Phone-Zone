// src/app/components/Pages/Category/CategoryProductList/index.tsx
import classNames from 'classnames/bind';
import Link from 'next/link';
import styles from './CategoryProductList.module.scss';

// Import component hiển thị từng thẻ sản phẩm
import ProductCard from '../../Home/ProductCard';

import { Product } from '@/types/product';

const cx = classNames.bind(styles);

interface Props {
    products: Product[];
    totalProducts: number;
}

function CategoryProductList({ products, totalProducts }: Props) {
    return (
        <section className={cx('section')}>
            {/* <div className={cx('header')}></div> */}

            <div className={cx('grid-list')}>
                {products.map((product) => (
                    <div key={product.id || product.slug} className={cx('card-wrapper')}>
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
}

export default CategoryProductList;
