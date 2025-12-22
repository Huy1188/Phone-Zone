// src/app/components/Pages/Category/index.tsx
'use client';

import { useMemo, useState, useEffect } from 'react';
import classNames from 'classnames/bind';
import styles from './CategoryPage.module.scss';
import { useRouter, useSearchParams } from 'next/navigation';

// Import Components
import CategoryHero from './CategoryHero';
import CategorySubnav from './CategorySubnav';
import CategoryBanner from './CategoryBanner';
import CategorySubList from './CategorySubList';
import type { CategorySubnavItem } from './CategorySubnav';
import CategoryFilters from './CategoryFilters';
import CategorySort from './CategorySort';
import CategoryProductList from './CategoryProductList';
import Pagination from '../../Common/Pagination';
import HotProduct from './CategorySection/HotProduct';
import CategoryFilterDrawer from './CategoryFilters/CategoryFilterDrawer';

import type { Product } from '@/types/product';
import type { CategorySubListItem } from './CategorySubList';

const cx = classNames.bind(styles);

interface CategoryPageProps {
    slug: string;
    searchParams?: { [key: string]: string | string[] | undefined };
    initialProducts?: Product[];
}

type SpecItem = { label: string; value: string };
type Option = { label: string; value: string };
type SpecFilterGroup = { title: string; options: Option[] };
function norm(s: string) {
  return (s ?? "")
    .toString()
    .trim()
    .replace(/\s+/g, " "); // gom nhiều space thành 1
}

const SPEC_CONFIG: Record<
  string,
  {
    allow: string[];
    maxOptions?: number;
  }
> = {
  phone: {
    allow: ["Màn hình", "RAM", "Bộ nhớ", "Pin", "Chip", "Camera"],
    maxOptions: 8,
  },
  laptop: {
    allow: ["CPU", "RAM", "Ổ cứng", "Màn hình", "Card đồ họa"],
    maxOptions: 6,
  },
};


// ... (Phần Gallery giữ nguyên) ...
const Galery1 = [
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/homelinemobi.png',
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/sdvdfnfhjjk.png',
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/dfbdfgbf6654555.png',
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/srbdfvfdvdf66666.png',
    'https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/tlmsiovojd.png',
];

// ... (Phần CONST FILTER giữ nguyên) ..

const SORT_OPTIONS = [
    { label: 'Phổ biến', value: 'popular', icon: 'fa-regular fa-star' },
    { label: 'Khuyến mãi HOT', value: 'hot-discount', icon: 'fa-solid fa-fire' },
    { label: 'Giá thấp → cao', value: 'price-asc', icon: 'fa-solid fa-arrow-up-short-wide' },
    { label: 'Giá cao → thấp', value: 'price-desc', icon: 'fa-solid fa-arrow-down-wide-short' },
];

type SelectedFilters = {
    brand: string[];
    priceRange: string[];
};

// ... (Phần SUBNAV_ITEMS giữ nguyên) ...
const SUBNAV_ITEMS: CategorySubnavItem[] = [
    { key: 'phone', label: 'Điện thoại', href: '/category/phone', iconClass: 'fa-solid fa-mobile' },
    { key: 'laptop', label: 'Laptop', href: '/category/laptop', iconClass: 'fa-solid fa-laptop' },
    { key: 'pc', label: 'PC', href: '/category/pc', iconClass: 'fa-solid fa-desktop' },
    { key: 'monitor', label: 'Màn hình', href: '/category/monitor', iconClass: 'fa-solid fa-display' },
    { key: 'build-pc', label: 'Build PC', href: '/category/build-pc', iconClass: 'fa-solid fa-screwdriver-wrench' },
    {
        key: 'components',
        label: 'Linh kiện máy tính',
        href: '/category/components',
        iconClass: 'fa-solid fa-microchip',
    },
];

const PAGE_SIZE = 10;

const checkPriceRange = (price: number, range: string) => {
    if (range === 'duoi-15') return price < 15000000;
    if (range === '15-20') return price >= 15000000 && price <= 20000000;
    if (range === 'tren-20') return price > 20000000;
    return false;
};

export default function CategoryPage({ slug, initialProducts }: CategoryPageProps) {
    const router = useRouter();
    const sp = useSearchParams();

    // ✅ URL là nguồn sự thật cho page/sort
    const currentPage = Number(sp.get('page') ?? 1);
    const sortBy = sp.get('sort') ?? 'popular';

    // ✅ Option A: data đã có từ SSR (full list)
    const [dbProducts, setDbProducts] = useState<Product[]>(initialProducts ?? []);
    const [loading, setLoading] = useState(!initialProducts);

    useEffect(() => {
        if (!initialProducts) return;
        setDbProducts(initialProducts);
        setLoading(false);
    }, [initialProducts]);

    const specFilterGroups: SpecFilterGroup[] = useMemo(() => {
        const map = new Map<string, Set<string>>();
        const cfg = SPEC_CONFIG[slug];

        dbProducts.forEach((p) => {
            const specs = p.specs ?? [];

            specs.forEach((sp) => {
                const label = norm(sp.label || '');
                const value = norm(sp.value || '');
                if (!label || !value) return;

                if (cfg?.allow && !cfg.allow.includes(label)) return;

                if (!map.has(label)) map.set(label, new Set());
                map.get(label)!.add(value);
            });
        });
        
        return Array.from(map.entries()).map(([label, values]) => ({
            title: label,
            options: Array.from(values)
                .sort((a, b) => a.localeCompare(b, 'vi'))
                .slice(0, cfg?.maxOptions ?? 8) // ✅ giới hạn option
                .map((v) => ({ label: v, value: v })),
        }));
    }, [dbProducts]);

    const setQuery = (next: Record<string, string | number | null | undefined>) => {
        const params = new URLSearchParams(sp.toString());

        Object.entries(next).forEach(([k, v]) => {
            if (v === null || v === undefined || v === '') params.delete(k);
            else params.set(k, String(v));
        });

        router.push(`/category/${slug}?${params.toString()}`, { scroll: false });
    };

    const BRAND_SUBLIST: CategorySubListItem[] = useMemo(() => {
        const brandMap = new Map<string, CategorySubListItem>();

        dbProducts.forEach((p) => {
            if (!p.brandSlug) return;
            const key = p.brandSlug.toLowerCase();

            if (!brandMap.has(key)) {
                brandMap.set(key, {
                    label: p.brand ?? p.brandSlug,
                    value: key,
                    image: p.brandLogo ?? '/no-image.png',
                });
            }
        });

        return Array.from(brandMap.values());
    }, [dbProducts]);

    const [selectedFilters, setSelectedFilters] = useState<SelectedFilters>({
        brand: [],
        priceRange: [],
    });
    const [selectedSpecs, setSelectedSpecs] = useState<Record<string, string[]>>({});
    const toggleSpecFilter = (specTitle: string, optionValue: string) => {
        setSelectedSpecs((prev) => {
            const current = prev[specTitle] ?? [];
            const exists = current.includes(optionValue);
            const nextValues = exists ? current.filter((v) => v !== optionValue) : [...current, optionValue];

            const next = { ...prev, [specTitle]: nextValues };
            if (next[specTitle].length === 0) delete next[specTitle];
            return next;
        });

        setQuery({ page: 1 });
    };

    const clearSpecFilters = () => setSelectedSpecs({});

    const handleToggleFilter = (key: keyof SelectedFilters, value: string) => {
        setSelectedFilters((prev) => {
            const isActive = prev[key].includes(value);
            const nextValues = isActive ? prev[key].filter((item) => item !== value) : [...prev[key], value];
            return { ...prev, [key]: nextValues };
        });

        // ✅ Option A: đổi filter thì reset page về 1
        setQuery({ page: 1 });
    };

    const handleClearAll = () => {
        setSelectedFilters({ brand: [], priceRange: [] });
        clearSpecFilters();
        // ✅ reset page về 1
        setQuery({ page: 1 });
    };

    const handleChangeSort = (value: string) => {
        // ✅ đổi sort => reset page về 1
        setQuery({ sort: value, page: 1 });
    };

    const filteredAndSortedProducts = useMemo(() => {
        let result = [...dbProducts];

        // 1) Brand
        if (selectedFilters.brand.length > 0) {
            result = result.filter((p) => {
                const slug = (p.brandSlug ?? '').toLowerCase();
                return selectedFilters.brand.includes(slug);
            });
        }

        // 2) Price
        if (selectedFilters.priceRange.length > 0) {
            result = result.filter((p) => selectedFilters.priceRange.some((range) => checkPriceRange(p.price, range)));
        }

        // 3) Specs (DB specifications)
        const specKeys = Object.keys(selectedSpecs);
        if (specKeys.length > 0) {
            result = result.filter((p) => {
                const specs = p.specs ?? [];

                const productMap = new Map<string, Set<string>>();
                specs.forEach((sp) => {
                    const label = norm(sp.label || '');
                    const value = norm(sp.value || '');
                    if (!label || !value) return;

                    if (!productMap.has(label)) productMap.set(label, new Set());
                    productMap.get(label)!.add(value);
                });

                for (const title of specKeys) {
                    const selectedValues = selectedSpecs[title] ?? [];
                    const productValues = productMap.get(title);
                    const ok = !!productValues && selectedValues.some((v) => productValues.has(v));
                    if (!ok) return false;
                }

                return true;
            });
        }

        // 4) Sort
        if (sortBy === 'price-asc') {
            result.sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-desc') {
            result.sort((a, b) => b.price - a.price);
        } else if (sortBy === 'hot-discount') {
            result.sort((a, b) => (b.discountRate || 0) - (a.discountRate || 0));
        }

        return result;
    }, [dbProducts, selectedFilters, selectedSpecs, sortBy]);

    const totalItems = filteredAndSortedProducts.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE));
    const safePage = Math.min(currentPage, totalPages);

    // ✅ Nếu URL đang page quá lớn (do filter làm giảm totalPages) -> tự sync URL về safePage
    // useEffect(() => {
    //     if (!Number.isFinite(currentPage)) return;
    //     if (currentPage !== safePage) setQuery({ page: safePage });
    //     // eslint-disable-next-line react-hooks/exhaustive-deps
    // }, [currentPage, safePage]);

    const paginatedProducts = useMemo(
        () => filteredAndSortedProducts.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE),
        [filteredAndSortedProducts, safePage],
    );

    // ✅ Fix title: slug key đang là "mobile"
    const title = slug === 'mobile' ? 'Điện thoại' : 'Sản phẩm';
    const [filterOpen, setFilterOpen] = useState(false);

    const brandFilters: Option[] = useMemo(() => {
        const map = new Map<string, string>(); // slug -> name
        dbProducts.forEach((p) => {
            const slug = (p.brandSlug ?? '').toLowerCase().trim();
            if (!slug) return;
            if (!map.has(slug)) map.set(slug, p.brand ?? slug);
        });
        return Array.from(map.entries()).map(([value, label]) => ({ value, label }));
    }, [dbProducts]);

    const priceFilters: Option[] = useMemo(() => {
        const ranges: Option[] = [
            { label: 'Dưới 15 triệu', value: 'duoi-15' },
            { label: '15 - 20 triệu', value: '15-20' },
            { label: 'Trên 20 triệu', value: 'tren-20' },
        ];
        return ranges.filter((r) => dbProducts.some((p) => checkPriceRange(p.price, r.value)));
    }, [dbProducts]);

    useEffect(() => {
        console.log('dbProducts[0].specifications =', (dbProducts as any)?.[0]?.specifications);
        console.log('specFilterGroups =', specFilterGroups);
    }, [dbProducts, specFilterGroups]);

    return (
        <div className={cx('wrapper')}>
            <div className={cx('inner')}>
                <CategoryHero title={title} />

                <div className={cx('content')}>
                    <CategorySubnav items={SUBNAV_ITEMS} activeKey={slug} />
                    <div className={cx('banner')}>
                        <CategoryBanner items={Galery1.map((url) => ({ url }))} />
                    </div>
                </div>

                <div className={cx('content')}>
                    <CategorySubList items={BRAND_SUBLIST} title="Chọn theo hãng" activeKey={false} />
                </div>

                <div className={cx('content')}>
                    <HotProduct />
                </div>

                <div className={cx('content')}>
                    <div className={cx('grid')}>
                        <div className={cx('desktopFilters')}>
                            <CategoryFilters
                                selectedFilters={selectedFilters}
                                onToggleFilter={handleToggleFilter}
                                onClearAll={handleClearAll}
                                brandFilters={brandFilters}
                                priceFilters={priceFilters}
                                specFilterGroups={specFilterGroups}
                                selectedSpecs={selectedSpecs}
                                onToggleSpec={toggleSpecFilter}
                            />
                        </div>

                        <div className={cx('top-row')}>
                            <button className={cx('filterBtn')} onClick={() => setFilterOpen(true)}>
                                <i className="fa-solid fa-filter" />
                                Bộ lọc
                            </button>

                            <CategorySort sortOptions={SORT_OPTIONS} sortBy={sortBy} onChangeSort={handleChangeSort} />
                        </div>

                        <CategoryFilterDrawer
                            open={filterOpen}
                            onClose={() => setFilterOpen(false)}
                            onApply={() => setFilterOpen(false)}
                            onReset={handleClearAll}
                            applyText={`Xem ${totalItems} sản phẩm`}
                        >
                            <CategoryFilters
                                selectedFilters={selectedFilters}
                                onToggleFilter={handleToggleFilter}
                                onClearAll={handleClearAll}
                                brandFilters={brandFilters}
                                priceFilters={priceFilters}
                                specFilterGroups={specFilterGroups}
                                selectedSpecs={selectedSpecs}
                                onToggleSpec={toggleSpecFilter}
                            />
                        </CategoryFilterDrawer>

                        {loading ? (
                            <div>Đang tải sản phẩm...</div>
                        ) : (
                            <CategoryProductList products={paginatedProducts} totalProducts={totalItems} />
                        )}

                        <Pagination
                            currentPage={safePage}
                            totalPages={totalPages}
                            onPageChange={(p) => {
                                setQuery({ page: p });
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
