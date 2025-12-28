import classNames from 'classnames/bind';
import styles from './page.module.scss';
import { fetchProductBySlug, fetchRelatedProducts } from '@/services/products';
import { notFound } from 'next/navigation';

import ReviewSection from '@/app/components/Pages/ProductDetail/ReviewSection';
import ProductDetailClient from '@/app/components/Pages/ProductDetail/ProductDetailClient';
import Gallery from '@/app/components/Pages/ProductDetail/Gallery';
import Info from '@/app/components/Pages/ProductDetail/Info';
import PriceBox from '@/app/components/Pages/ProductDetail/PriceBox';
import SpecsTable from '@/app/components/Pages/ProductDetail/SpecsTable';
import ProductCarousel from '@/app/components/Common/ProductCarousel';
import Link from 'next/link';

const cx = classNames.bind(styles);

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params; // Next 15+ cần await params

    // 1) Lấy product từ API (Style A)
    const product = await fetchProductBySlug(slug);

    // 2) Nếu không có product -> 404
    if (!product) notFound();

    // 3) Lấy related từ API (tạm dùng fetchProducts rồi filter)
    const related = product.brandSlug
        ? await fetchRelatedProducts({
              brandSlug: product.brandSlug,
              excludeSlug: product.slug,
              // limit: 5,
          })
        : [];

    return (
        <div className={cx('container')}>
            <div className={cx('breadcrumb')}>
                <Link href="/">
                    <i className="fa-solid fa-house"></i>
                    Trang chủ
                </Link>
                <span className={cx('separator')}>/ Điện thoại /</span>
                {product.name}
            </div>

            <div className={cx('main-layout')}>
                {/* chuyển vào client */}
                <ProductDetailClient product={product} />
            </div>

            {related.length > 0 && (
                <div className={cx('related-section')}>
                    <ProductCarousel title="Sản phẩm tương tự" products={related} />
                </div>
            )}

            <div className={cx('bottom-layout')}>
                <div className={cx('description')}>
                    <h2>Đánh giá chi tiết</h2>
                    <div dangerouslySetInnerHTML={{ __html: product.description }} />
                </div>

                <div className={cx('specs')}>
                    <SpecsTable specs={product.specs} />
                </div>
            </div>
            <div className={cx('section')}>
                <ReviewSection productId={Number(product.id)} />
            </div>
        </div>
    );
}
