// src/app/components/Pages/Category/CategoryProductList/index.tsx
import classNames from 'classnames/bind';
import Link from 'next/link';
import styles from './CategoryProductList.module.scss';

// Import component hiển thị từng thẻ sản phẩm
import ProductCard from '../../Home/ProductCard';

// Import kiểu dữ liệu từ file index.tsx của thư mục cha
import type { CategoryProduct } from '..';

const cx = classNames.bind(styles);

interface Props {
  products: CategoryProduct[];
  totalProducts: number;
}

function CategoryProductList({ products, totalProducts }: Props) {
  return (
    <section className={cx('section')}>
      <div className={cx('header')}>
        {/* <h2 className={cx('title')}>{totalProducts} sản phẩm</h2> */}
      </div>

      <div className={cx('grid-list')}>
        {products.map((product) => (
          // 1. CHUYỂN KEY LÊN THẺ LINK (Thẻ cha ngoài cùng)
          // 2. Dùng id làm key (nếu có) hoặc slug
          <Link 
            key={product.id || product.slug} 
            href={`/product/${product.slug}`} 
            className={cx('card-wrapper')} // Đổi style.card thành cx('card-wrapper') cho đồng bộ
          >
            {/* Truyền prop product vào ProductCard */}
            <ProductCard product={product} />
          </Link>
        ))}
      </div>
    </section>
  );
}

export default CategoryProductList;