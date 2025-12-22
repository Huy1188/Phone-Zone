import classNames from "classnames/bind";
import styles from "./page.module.scss";
import { fetchProductBySlug, fetchProducts } from "@/services/products";
import { notFound } from "next/navigation";

import Gallery from "@/app/components/Pages/ProductDetail/Gallery";
import Info from "@/app/components/Pages/ProductDetail/Info";
import PriceBox from "@/app/components/Pages/ProductDetail/PriceBox";
import SpecsTable from "@/app/components/Pages/ProductDetail/SpecsTable";
import ProductCarousel from "@/app/components/Common/ProductCarousel";
import Link from "next/link";

const cx = classNames.bind(styles);

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  
  const { slug } = await params; // Next 15+ cần await params

  // 1) Lấy product từ API (Style A)
  const product = await fetchProductBySlug(slug);

  // 2) Nếu không có product -> 404
  if (!product) notFound();

  // 3) Lấy related từ API (tạm dùng fetchProducts rồi filter)
  const all = await fetchProducts();
  const related = all
    .filter((p) => p.slug !== product.slug && p.brand === product.brand)
    .slice(0, 5);

  return (
    <div className={cx("container")}>
      <div className={cx("breadcrumb")}>
        <Link href="/">
          <i className="fa-solid fa-house"></i>
          Trang chủ
        </Link>
        <span className={cx("separator")}>/ Điện thoại /</span>
        {product.name}
      </div>

      <div className={cx("main-layout")}>
        <div className={cx("left-col")}>
          <Gallery images={product.images} />
        </div>

        <div className={cx("right-col")}>
          <Info name={product.name} sku={product.sku} rating={product.rating} />
          <PriceBox product={product} />
        </div>
      </div>

      {/* Sản phẩm tương tự */}
      <div className={cx("related-section")}>
        <ProductCarousel title="Sản phẩm tương tự" products={related} />
      </div>

      <div className={cx("bottom-layout")}>
        <div className={cx("description")}>
          <h2>Đánh giá chi tiết</h2>
          <div dangerouslySetInnerHTML={{ __html: product.description }} />
        </div>

        <div className={cx("specs")}>
          <SpecsTable specs={product.specs} />
        </div>
      </div>
    </div>
  );
}
