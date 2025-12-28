'use client';

import classNames from 'classnames/bind';
import styles from '@/app/product/[slug]/page.module.scss';
import { useMemo, useState } from 'react';
import type { Product } from '@/types/product';

import Gallery from '@/app/components/Pages/ProductDetail/Gallery';
import Info from '@/app/components/Pages/ProductDetail/Info';
import PriceBox from '@/app/components/Pages/ProductDetail/PriceBox';
import VariantSelector from '@/app/components/Pages/ProductDetail/VariantSelector';

const cx = classNames.bind(styles);

type Props = { product: Product };

export default function ProductDetailClient({ product }: Props) {
    // ✅ lựa chọn độc lập
    const [selColor, setSelColor] = useState<string | null>(null);
    const [selRam, setSelRam] = useState<string | null>(null);
    const [selRom, setSelRom] = useState<string | null>(null);

    // ✅ resolve ra variant hợp lệ theo lựa chọn hiện tại
    const resolvedVariant = useMemo(() => {
        const variants = product.variants ?? [];
        if (!variants.length) return null;

        // chưa chọn gì -> default
        if (!selColor && !selRam && !selRom) return variants[0];

        // lọc theo các field đã chọn (field nào chưa chọn thì bỏ qua)
        const candidates = variants.filter((v) => {
            const okColor = !selColor || (v.color ?? '') === selColor;
            const okRam = !selRam || (v.ram ?? '') === selRam;
            const okRom = !selRom || (v.rom ?? '') === selRom;
            return okColor && okRam && okRom;
        });

        // nếu chọn combo không tồn tại -> null (để PriceBox có thể disable mua)
        return candidates[0] ?? null;
    }, [product.variants, selColor, selRam, selRom]);

    // ✅ ảnh ưu tiên theo variant
    const images = useMemo(() => {
        const vImg = resolvedVariant?.image ? [resolvedVariant.image] : [];
        const rest = product.images ?? [];
        return Array.from(new Set([...vImg, ...rest])).filter(Boolean);
    }, [resolvedVariant?.image, product.images]);

    const sku = resolvedVariant?.sku ?? product.sku;

    const variantImages = useMemo(() => {
        const variants = product.variants ?? [];
        const map = new Map<string, string>(); // color -> image

        const isPlaceholder = (url?: string | null) => !url || url.includes('/placeholder.png');

        // ưu tiên ảnh thật trước, sau đó mới lấy placeholder nếu bắt buộc
        for (const v of variants) {
            const color = (v.color ?? '').trim();
            if (!color) continue;

            const img = v.image ?? '';
            if (!img) continue;

            // nếu màu chưa có ảnh -> set luôn
            if (!map.has(color)) {
                map.set(color, img);
                continue;
            }

            // nếu đang là placeholder mà gặp ảnh thật -> replace
            const current = map.get(color)!;
            if (isPlaceholder(current) && !isPlaceholder(img)) {
                map.set(color, img);
            }
        }

        return Array.from(map.values());
    }, [product.variants]);

    return (
        <>
            <div className={cx('left-col')}>
                <Gallery images={images} extraThumbs={variantImages} />
            </div>

            <div className={cx('right-col')}>
                <Info name={product.name} sku={product.sku} rating={product.rating} reviewCount={product.reviewCount} />

                {!!product.variants?.length && (
                    <VariantSelector
                        variants={product.variants}
                        selColor={selColor}
                        selRam={selRam}
                        selRom={selRom}
                        onChangeColor={setSelColor}
                        onChangeRam={setSelRam}
                        onChangeRom={setSelRom}
                    />
                )}

                <PriceBox product={product} selectedVariant={resolvedVariant} />
            </div>
        </>
    );
}
