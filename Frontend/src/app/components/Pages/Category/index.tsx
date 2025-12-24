// src/app/components/Pages/Category/index.tsx
"use client";

import { useEffect, useMemo, useState } from "react";
import classNames from "classnames/bind";
import styles from "./CategoryPage.module.scss";
import { useRouter, useSearchParams } from "next/navigation";

// Components
import CategoryHero from "./CategoryHero";
import CategorySubnav from "./CategorySubnav";
import CategoryBanner from "./CategoryBanner";
import CategorySubList from "./CategorySubList";
import type { CategorySubnavItem } from "./CategorySubnav";
import CategoryFilters from "./CategoryFilters";
import CategoryProductList from "./CategoryProductList";
import HotProduct from "./CategorySection/HotProduct";
import CategoryFilterDrawer from "./CategoryFilters/CategoryFilterDrawer";
import Pagination from "@/app/components/Common/Pagination";
import Sortbar from "@/app/components/Common/Sortbar";

import { fetchCategories } from "@/services/categories";
import { fetchProductsPaged } from "@/services/products";
import type { Product } from "@/types/product";
import type { CategorySubListItem } from "./CategorySubList";

const cx = classNames.bind(styles);

interface CategoryPageProps {
  slug: string;
}

type Facets = {
  brands: Array<{
    brand_id: number;
    name: string;
    slug: string;
    logo_url?: string | null;
    origin?: string | null;
  }>;
  price_ranges: Record<string, number>;
  specs: Record<string, string[]>;
};

type Option = { label: string; value: string };
type SpecFilterGroup = { title: string; options: Option[] };

function norm(s: string) {
  return (s ?? "").toString().trim().replace(/\s+/g, " ");
}

// Filter config per category
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

// Banner mock giữ nguyên
const Galery1 = [
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/homelinemobi.png",
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/sdvdfnfhjjk.png",
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/dfbdfgbf6654555.png",
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/srbdfvfdvdf66666.png",
  "https://cdn2.cellphones.com.vn/insecure/rs:fill:595:100/q:100/plain/https://dashboard.cellphones.com.vn/storage/tlmsiovojd.png",
];

const PAGE_SIZE = 10;

// Sortbar (Common) uses: newest | price_asc | price_desc | discount_desc
// Backend expects: newest | price-asc | price-desc | hot-discount
const mapSortToBackend = (s: string) => {
  if (s === "price_asc") return "price-asc";
  if (s === "price_desc") return "price-desc";
  if (s === "discount_desc") return "hot-discount";
  return "newest";
};

const parseSpecs = (raw: string | null): Record<string, string[]> => {
  if (!raw) return {};
  try {
    const obj = JSON.parse(raw);
    if (!obj || typeof obj !== "object") return {};
    const out: Record<string, string[]> = {};
    Object.entries(obj).forEach(([k, v]) => {
      const kk = norm(k);
      const vv = Array.isArray(v) ? v : [v];
      const values = vv.map((x) => norm(String(x))).filter(Boolean);
      if (kk && values.length) out[kk] = values;
    });
    return out;
  } catch {
    return {};
  }
};

export default function CategoryPage({ slug }: CategoryPageProps) {
  const router = useRouter();
  const sp = useSearchParams();

  // =========================
  // Category Subnav from DB
  // =========================
  const [subnavItems, setSubnavItems] = useState<CategorySubnavItem[]>([]);
  useEffect(() => {
    (async () => {
      try {
        const cats = await fetchCategories();

        const ICON_MAP: Record<string, string> = {
          phone: "fa-solid fa-mobile",
          laptop: "fa-solid fa-laptop",
          pc: "fa-solid fa-desktop",
          monitor: "fa-solid fa-display",
          "build-pc": "fa-solid fa-screwdriver-wrench",
          components: "fa-solid fa-microchip",
        };

        const items: CategorySubnavItem[] = cats
          .slice()
          .sort((a, b) => a.category_id - b.category_id)
          .map((c) => ({
            key: c.slug,
            label: c.name,
            href: `/category/${c.slug}`,
            iconClass: ICON_MAP[c.slug] || "fa-solid fa-tag",
          }));

        setSubnavItems(items);
      } catch (e) {
        console.error("fetchCategories failed:", e);
        setSubnavItems([]);
      }
    })();
  }, []);

  // =========================
  // URL state (single source of truth)
  // =========================
  const currentPage = Math.max(1, Number(sp.get("page") ?? 1));
  const sortBy = sp.get("sort") ?? "newest";
  const selectedBrandSlugs = sp.getAll("brand_slug");
  const selectedPriceRanges = sp.getAll("price_range");
  const selectedSpecs = useMemo(() => parseSpecs(sp.get("specs")), [sp]);

  // =========================
  // Data from backend
  // =========================
  const [products, setProducts] = useState<Product[]>([]);
  const [meta, setMeta] = useState({ total: 0, page: 1, limit: PAGE_SIZE });
  const [facets, setFacets] = useState<Facets | null>(null);
  const [loading, setLoading] = useState(true);
  const [filterOpen, setFilterOpen] = useState(false);

  // Fetch products + facets (Option 1: filter/spec on backend)
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);

        const res = await fetchProductsPaged({
          category_slug: slug,
          page: currentPage,
          limit: PAGE_SIZE,
          sort: mapSortToBackend(sortBy),
          brand_slug: selectedBrandSlugs,
          price_range: selectedPriceRanges,
          specs: sp.get("specs") || undefined,
          facets: 1,
        });

        setProducts(res.products);
        setMeta(res.meta);
        setFacets((res.facets as unknown as Facets) ?? null);
      } catch (e) {
        console.error("fetchProductsPaged failed:", e);
        setProducts([]);
        setMeta({ total: 0, page: 1, limit: PAGE_SIZE });
        setFacets(null);
      } finally {
        setLoading(false);
      }
    })();
  }, [slug, currentPage, sortBy, sp.toString()]);

  // =========================
  // Query helpers
  // =========================
  const pushParams = (next: URLSearchParams) => {
    const qs = next.toString();
    router.push(qs ? `/category/${slug}?${qs}` : `/category/${slug}`, { scroll: false });
  };

  const setQuery = (patch: Record<string, string | number | null | undefined>) => {
    const params = new URLSearchParams(sp.toString());
    Object.entries(patch).forEach(([k, v]) => {
      if (v === null || v === undefined || v === "") params.delete(k);
      else params.set(k, String(v));
    });
    pushParams(params);
  };

  const setMultiParam = (key: string, values: string[]) => {
    const params = new URLSearchParams(sp.toString());
    params.delete(key);
    values.forEach((v) => params.append(key, v));
    // reset page when filter changes
    params.set("page", "1");
    pushParams(params);
  };

  const toggleMultiParam = (key: string, value: string) => {
    const params = new URLSearchParams(sp.toString());
    const current = params.getAll(key);
    const exists = current.includes(value);
    const next = exists ? current.filter((x) => x !== value) : [...current, value];
    setMultiParam(key, next);
  };

  const setSpecsParam = (obj: Record<string, string[]>) => {
    const params = new URLSearchParams(sp.toString());
    const hasAny = Object.keys(obj).length > 0;

    if (!hasAny) params.delete("specs");
    else params.set("specs", JSON.stringify(obj));

    params.set("page", "1");
    pushParams(params);
  };

  const toggleSpecFilter = (specTitle: string, optionValue: string) => {
    const next = { ...selectedSpecs };
    const cur = next[specTitle] ?? [];
    const exists = cur.includes(optionValue);
    const nextValues = exists ? cur.filter((v) => v !== optionValue) : [...cur, optionValue];

    if (nextValues.length) next[specTitle] = nextValues;
    else delete next[specTitle];

    setSpecsParam(next);
  };

  const clearAllFilters = () => {
    const params = new URLSearchParams(sp.toString());
    params.delete("specs");
    params.delete("brand_slug");
    params.delete("price_range");
    params.set("page", "1");
    pushParams(params);
  };

  // =========================
  // Facets -> Filters UI
  // =========================
  const brandFilters: Option[] = useMemo(() => {
    const brands = facets?.brands ?? [];
    return brands
      .filter((b) => b.slug)
      .map((b) => ({ value: String(b.slug), label: String(b.name) }));
  }, [facets]);

  const priceFilters: Option[] = useMemo(() => {
    const counts = facets?.price_ranges ?? {};
    const ranges: Option[] = [
      { label: "Dưới 15 triệu", value: "duoi-15" },
      { label: "15 - 20 triệu", value: "15-20" },
      { label: "Trên 20 triệu", value: "tren-20" },
    ];
    return ranges.filter((r) => Number((counts as Record<string, number>)[r.value] ?? 0) > 0);
  }, [facets]);

  const specFilterGroups: SpecFilterGroup[] = useMemo(() => {
    const cfg = SPEC_CONFIG[slug];
    const all = facets?.specs ?? {};
    const allow = cfg?.allow ?? Object.keys(all);
    const maxOptions = cfg?.maxOptions ?? 8;

    return allow
      .filter((k) => !!all[k] && all[k].length > 0)
      .map((k) => ({
        title: k,
        options: all[k].slice(0, maxOptions).map((v) => ({ label: v, value: v })),
      }));
  }, [facets, slug]);

  const brandSubList: CategorySubListItem[] = useMemo(() => {
    const brands = facets?.brands ?? [];
    return brands
      .filter((b) => b.slug)
      .map((b) => ({
        label: b.name,
        value: b.slug,
        image: (b.logo_url as any) || "/no-image.png",
      }));
  }, [facets]);

  // =========================
  // Pagination from backend meta
  // =========================
  const totalItems = meta.total;
  const totalPages = Math.max(1, Math.ceil(totalItems / (meta.limit || PAGE_SIZE)));
  const safePage = Math.min(currentPage, totalPages);

  const title = slug === "mobile" ? "Điện thoại" : "Sản phẩm";

  return (
    <div className={cx("wrapper")}>
      <div className={cx("inner")}>
        <CategoryHero title={title} />

        <div className={cx("content")}>
          <CategorySubnav items={subnavItems} activeKey={slug} />
          <div className={cx("banner")}>
            <CategoryBanner items={Galery1.map((url) => ({ url }))} />
          </div>
        </div>

        <div className={cx("content")}>
          <CategorySubList items={brandSubList} title="Chọn theo hãng" activeKey={false} />
        </div>

        <div className={cx("content")}>
          <HotProduct categorySlug={slug} />
        </div>

        <div className={cx("content")}>
          <div className={cx("grid")}>
            <div className={cx("desktopFilters")}>
              <CategoryFilters
                selectedFilters={{ brand: selectedBrandSlugs, priceRange: selectedPriceRanges }}
                onToggleFilter={(key: any, value: string) => {
                  if (key === "brand") toggleMultiParam("brand_slug", value);
                  if (key === "priceRange") toggleMultiParam("price_range", value);
                }}
                onClearAll={clearAllFilters}
                brandFilters={brandFilters}
                priceFilters={priceFilters}
                specFilterGroups={specFilterGroups}
                selectedSpecs={selectedSpecs}
                onToggleSpec={toggleSpecFilter}
              />
            </div>

            <div className={cx("top-row")}>
              <button className={cx("filterBtn")} onClick={() => setFilterOpen(true)}>
                <i className="fa-solid fa-filter" />
                Bộ lọc
              </button>

              <Sortbar
                value={sortBy}
                onChange={(value) => {
                  setQuery({ sort: value, page: 1 });
                }}
              />
            </div>

            <CategoryFilterDrawer
              open={filterOpen}
              onClose={() => setFilterOpen(false)}
              onApply={() => setFilterOpen(false)}
              onReset={clearAllFilters}
              applyText={`Xem ${totalItems} sản phẩm`}
            >
              <CategoryFilters
                selectedFilters={{ brand: selectedBrandSlugs, priceRange: selectedPriceRanges }}
                onToggleFilter={(key: any, value: string) => {
                  if (key === "brand") toggleMultiParam("brand_slug", value);
                  if (key === "priceRange") toggleMultiParam("price_range", value);
                }}
                onClearAll={clearAllFilters}
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
              <CategoryProductList products={products} totalProducts={totalItems} />
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
