
import classNames from "classnames/bind";
import styles from "./ProductCard.module.scss";
import Image from "next/image";
import Link from "next/link";
import { formatPrice } from "@/lib/formatPrice";

import type { Product } from "@/types/product";

const cx = classNames.bind(styles);

interface Props {
  product: Product;
}

function ProductCard({ product }: Props) {
  const staticBase = process.env.NEXT_PUBLIC_STATIC_BASE || "";

const rawThumb = product.images?.length ? product.images[0] : "/no-image.png";


const path = rawThumb.startsWith("/") ? rawThumb : `/${rawThumb}`;


const thumbnail = rawThumb.startsWith("http")
  ? rawThumb
  : rawThumb === "/no-image.png"
    ? rawThumb
    : `${staticBase}${path}`;


  
  const discount =
    typeof product.discountRate === "number"
      ? product.discountRate
      : typeof product.originalPrice === "number"
        ? calcDiscount(product.originalPrice, product.price)
        : 0;

  
  const rating = typeof product.rating === "number" ? product.rating : 0;
  const reviewCount = typeof product.reviewCount === "number" ? product.reviewCount : 0;

  return (
    <Link href={`/product/${product.slug}`} className={cx("card")}>
      {}
      {discount > 0 && <span className={cx("discount")}>-{discount}%</span>}

      {}
      {product.promotions?.length ? <span className={cx("gift")}>🎁 Quà tặng HOT</span> : null}

      {}
      <div className={cx("thumb")}>
        <Image
          src={thumbnail}
          alt={product.name}
          width={300}
          height={300}
          className={cx("img")}
          unoptimized
        />
      </div>

      {}
      <h3 className={cx("title")}>{product.name}</h3>

      {}
      {product.specs?.length ? (
        <ul className={cx("specs")}>
          {product.specs.slice(0, 3).map((s, i) => (
            <li key={i}>{s.value}</li>
          ))}
        </ul>
      ) : null}

      {}
      <div className={cx("price-row")}>
        <span className={cx("price-main")}>{formatPrice(product.price)}</span>

        {typeof product.originalPrice === "number" && product.originalPrice > product.price ? (
          <span className={cx("price-old")}>{formatPrice(product.originalPrice)}</span>
        ) : null}
      </div>

      {}
      {product.badge ? <span className={cx("badge")}>{product.badge}</span> : null}

      {}
      {rating > 0 ? (
        <div className={cx("rating")}>
          <span className={cx("ratingValue")}>
            {rating} <i className="fa-solid fa-star" />
          </span>
          <span className={cx("reviewCount")}>({reviewCount} đánh giá)</span>
        </div>
      ) : null}
    </Link>
  );
}

export default ProductCard;

function calcDiscount(oldPrice: number, newPrice: number): number {
  if (!oldPrice || !newPrice || oldPrice <= newPrice) return 0;
  return Math.round(((oldPrice - newPrice) / oldPrice) * 100);
}
