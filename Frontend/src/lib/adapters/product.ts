import type { Product, ProductSpec } from '@/types/product';
import type { BackendProduct, BackendSpec } from '@/types/backend';

const STATIC_BASE = process.env.NEXT_PUBLIC_STATIC_BASE;

function parseSpecs(specifications: string): ProductSpec[] {
    try {
        const v = JSON.parse(specifications || '[]');
        return Array.isArray(v) ? v : [];
    } catch {
        return [];
    }
}

function resolveImages(p: BackendProduct): string[] {
    if (p.image) {
        return [p.image.startsWith('http') ? p.image : `${STATIC_BASE}${p.image}`];
    }

    // 2. Fallback: variants (detail page)
    if (p.variants?.length) {
        return p.variants
            .map((v) => v.image)
            .filter(Boolean)
            .map((img) => (img.startsWith('http') ? img : `${STATIC_BASE}${img}`));
    }

    return [];
}

export function mapBackendProductToProduct(p: BackendProduct): Product {
  const firstVariant = p.variants?.[0];

  // giá hiện tại
  const price = Number(firstVariant?.price ?? p.min_price ?? 0);

  // ✅ discount % từ BE (fallback 0)
  const discountRate = Number(p.discount ?? 0);

  // ✅ suy ra giá gốc để gạch: original = price / (1 - discount%)
  // chỉ tính khi discount hợp lệ
  const originalPrice =
    discountRate > 0 && discountRate < 100
      ? Math.round(price / (1 - discountRate / 100))
      : undefined;

  const brandSlug = p.brand?.slug;
  const rawLogo = p.brand?.logo_url ?? null;

  const brandLogo = rawLogo
    ? rawLogo.startsWith('http')
      ? rawLogo
      : `${STATIC_BASE}${rawLogo}`
    : undefined;

  return {
    id: String(p.product_id),
    slug: p.slug,
    sku: firstVariant?.sku ?? `SKU-${p.product_id}`,
    name: p.name,

    price,
    originalPrice,     // ✅ FIX
    discountRate,      // ✅ FIX

    rating: 0,
    reviewCount: 0,
    images: resolveImages(p),

    brand: p.brand?.name,
    brandSlug,
    brandLogo,

    variants: (p.variants ?? []).map((v) => {
      const raw = v.image || '';
      const full = !raw ? '/placeholder.png' : raw.startsWith('http') ? raw : `${STATIC_BASE}${raw}`;

      return {
        variant_id: v.variant_id,
        price: Number(v.price),
        image: full,
      };
    }),

    usage: p.category?.name,
    badge: p.is_hot ? 'Hot' : undefined,
    specs: parseSpecs(p.specifications),
    promotions: p.promotion,
    warranty: '12 Tháng',
    status: 'available',
    description: p.description,
  };
}

