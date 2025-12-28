import type { Product, ProductSpec } from '@/types/product';
import type { BackendProduct } from '@/types/backend';

const STATIC_BASE = process.env.NEXT_PUBLIC_STATIC_BASE || '';

function parseSpecs(specifications: any): ProductSpec[] {
    if (Array.isArray(specifications)) return specifications as ProductSpec[];
    if (specifications && typeof specifications === 'object') return [];
    try {
        const v = JSON.parse(String(specifications || '[]'));
        return Array.isArray(v) ? v : [];
    } catch {
        return [];
    }
}

function toFullUrl(path?: string | null) {
    if (!path) return '';
    return path.startsWith('http') ? path : `${STATIC_BASE}${path}`;
}

function resolveImages(p: BackendProduct): string[] {
    // ✅ 1) gallery images (thumbnail first)
    const gallery =
        p.images
            ?.slice()
            .sort((a, b) => Number(b.is_thumbnail) - Number(a.is_thumbnail))
            .map((i) => toFullUrl(i.image_url))
            .filter(Boolean) ?? [];

    if (gallery.length) return gallery;

    // ✅ 2) fallback main image
    const main = toFullUrl(p.image);
    if (main) return [main];

    // ✅ 3) fallback variants
    const vimgs = p.variants?.map((v) => toFullUrl(v.image)).filter(Boolean) ?? [];

    return vimgs;
}

export function mapBackendProductToProduct(p: BackendProduct): Product {
    const firstVariant = p.variants?.[0];

    const price = Number(firstVariant?.price ?? p.min_price ?? 0);

    const discountRate = Number(p.discount ?? 0);
    const originalPrice =
        discountRate > 0 && discountRate < 100 ? Math.round(price / (1 - discountRate / 100)) : undefined;

    const brandLogo = p.brand?.logo_url ? toFullUrl(p.brand.logo_url) : null;

    return {
        id: String(p.product_id),
        slug: p.slug,
        sku: firstVariant?.sku ?? `SKU-${p.product_id}`,
        name: p.name,

        price,
        originalPrice,
        discountRate,

        rating: Number((p as any).rating ?? 0),
        reviewCount: Number((p as any).reviewCount ?? 0),

        images: resolveImages(p),

        brand: p.brand?.name,
        brandSlug: p.brand?.slug,
        brandLogo,

        variants: (p.variants ?? []).map((v) => ({
            variant_id: v.variant_id,
            price: Number(v.price),
            image: toFullUrl(v.image) || '/placeholder.png',

            sku: v.sku,
            color: v.color ?? null,
            ram: v.ram ?? null,
            rom: v.rom ?? v.storage ?? null, // ✅ ưu tiên rom
            stock: typeof v.stock === 'number' ? v.stock : null,
        })),

        usage: p.category?.name,
        badge: p.is_hot ? 'Hot' : undefined,
        specs: parseSpecs(p.specifications),
        promotions: p.promotion ?? null,
        warranty: '12 Tháng',
        status: p.is_active ? 'available' : 'out_of_stock',
        description: p.description ?? '',
    };
}
