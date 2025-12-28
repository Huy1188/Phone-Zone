import db from '../models/index';
import { Op, Sequelize } from 'sequelize';

// =====================
// Helpers
// =====================

const toArray = (v) => {
    if (v === undefined || v === null) return [];
    if (Array.isArray(v))
        return v
            .map(String)
            .map((s) => s.trim())
            .filter(Boolean);
    return String(v)
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
};

// Escape a JS string to be safe inside a single-quoted SQL literal.
const sqlEscapeSingle = (s) => String(s).replace(/\\/g, '\\\\').replace(/'/g, "\\'");

const parseSpecsParam = (raw) => {
    if (!raw) return null;
    try {
        const obj = typeof raw === 'string' ? JSON.parse(raw) : raw;
        if (!obj || typeof obj !== 'object') return null;

        const out = {};
        Object.entries(obj).forEach(([k, v]) => {
            const title = String(k || '').trim();
            if (!title) return;
            const values = Array.isArray(v) ? v : [v];
            const vv = values.map((x) => String(x).trim()).filter(Boolean);
            if (vv.length) out[title] = vv;
        });

        return Object.keys(out).length ? out : null;
    } catch {
        return null;
    }
};

const buildPriceWhere = ({ price_min, price_max, price_range }) => {
    const and = [];

    const min = price_min !== undefined && price_min !== null ? Number(price_min) : null;
    const max = price_max !== undefined && price_max !== null ? Number(price_max) : null;

    // custom min/max
    if (Number.isFinite(min) || Number.isFinite(max)) {
        const w = {};
        if (Number.isFinite(min)) w[Op.gte] = min;
        if (Number.isFinite(max)) w[Op.lte] = max;
        and.push({ min_price: w });
        return and;
    }

    // buckets by FE
    const ranges = toArray(price_range);
    if (!ranges.length) return and;

    const or = [];
    ranges.forEach((r) => {
        if (r === 'duoi-15') or.push({ min_price: { [Op.lt]: 15000000 } });
        if (r === '15-20') or.push({ min_price: { [Op.between]: [15000000, 20000000] } });
        if (r === 'tren-20') or.push({ min_price: { [Op.gt]: 20000000 } });
    });

    if (or.length) and.push({ [Op.or]: or });
    return and;
};

// Build SQL conditions for JSON specs stored as array of objects: [{label, value}, ...]
const buildSpecsWhereLiterals = (specsObj) => {
    if (!specsObj) return [];

    const andLiterals = [];
    for (const [title, values] of Object.entries(specsObj)) {
        const ors = values.map((val) => {
            const needle = JSON.stringify({ label: title, value: val });
            return `JSON_CONTAINS(specifications, '${sqlEscapeSingle(needle)}', '$')`;
        });
        if (ors.length) andLiterals.push(`(${ors.join(' OR ')})`);
    }

    return andLiterals;
};

export const getHomePage = async (req, res) => {
    try {
        const {
            category_slug,
            brand_slug,
            q,
            sort = 'newest',
            page = 1,
            limit = 20,

            // filters
            price_range,
            price_min,
            price_max,
            specs,

            // facets for filter UI
            facets = '0',
        } = req.query;

        // Base where: category + search only (for facets)
        const baseWhere = { is_active: true };

        if (category_slug) {
            const category = await db.Category.findOne({ where: { slug: category_slug } });
            if (!category) {
                return res.json({
                    success: true,
                    products: [],
                    meta: { total: 0, page: 1, limit: 20 },
                    facets: facets === '1' ? { brands: [], price_ranges: {}, specs: {} } : undefined,
                });
            }
            baseWhere.category_id = category.category_id;
        }

        if (q && String(q).trim()) {
            const kw = String(q).trim();
            baseWhere.name = { [Op.like]: `%${kw}%` };
        }

        // Filtered where: base + brand + price + specs
        const whereProduct = { ...baseWhere };

        // brand_slug multi
        const brandSlugs = toArray(brand_slug);
        if (brandSlugs.length) {
            const brands = await db.Brand.findAll({
                where: { slug: { [Op.in]: brandSlugs } },
                attributes: ['brand_id'],
            });

            if (!brands.length) {
                return res.json({
                    success: true,
                    products: [],
                    meta: { total: 0, page: 1, limit: 20 },
                    facets: facets === '1' ? { brands: [], price_ranges: {}, specs: {} } : undefined,
                });
            }
            whereProduct.brand_id = { [Op.in]: brands.map((b) => b.brand_id) };
        }

        // price
        const priceAnd = buildPriceWhere({ price_min, price_max, price_range });
        if (priceAnd.length) {
            whereProduct[Op.and] = (whereProduct[Op.and] || []).concat(priceAnd);
        }

        // specs (JSON)
        const specsObj = parseSpecsParam(specs);
        const specLits = buildSpecsWhereLiterals(specsObj);
        if (specLits.length) {
            whereProduct[Op.and] = (whereProduct[Op.and] || []).concat(specLits.map((sql) => Sequelize.literal(sql)));
        }

        // paging
        const pageNum = Math.max(1, Number(page) || 1);
        const limitNum = Math.min(50, Math.max(1, Number(limit) || 20));
        const offset = (pageNum - 1) * limitNum;

        // sort
        const minPriceCast = Sequelize.literal('CAST(min_price AS UNSIGNED)');
        let order = [['createdAt', 'DESC']];
        if (sort === 'price-asc') order = [[minPriceCast, 'ASC']];
        if (sort === 'price-desc') order = [[minPriceCast, 'DESC']];
        if (sort === 'hot')
            order = [
                ['is_hot', 'DESC'],
                ['createdAt', 'DESC'],
            ];
        if (sort === 'hot-discount') order = [[Sequelize.literal('CAST(discount AS UNSIGNED)'), 'DESC']];
        if (sort === 'popular') order = [['createdAt', 'DESC']];

        const { rows, count } = await db.Product.findAndCountAll({
            where: whereProduct,
            include: [
                { model: db.Category, as: 'category', attributes: ['name', 'slug', 'image'] },
                { model: db.Brand, as: 'brand', attributes: ['name', 'slug', 'logo_url', 'origin'] },
                { model: db.ProductImage, as: 'images', attributes: ['image_url', 'is_thumbnail'] },
                {
                    model: db.ProductVariant,
                    as: 'variants',
                    attributes: ['variant_id', 'sku', 'price', 'image'],
                    limit: 1,
                    order: [['variant_id', 'ASC']],
                    separate: true,
                },
            ],
            order,
            limit: limitNum,
            offset,
            distinct: true,
        });

        // const products = rows.map((p) => {
        //   const plain = p.toJSON();
        //   const mainImg =
        //     plain.images?.find((img) => img.is_thumbnail)?.image_url ||
        //     plain.images?.[0]?.image_url ||
        //     plain.variants?.[0]?.image ||
        //     plain.image ||
        //     null;
        //   return { ...plain, image: mainImg };
        // });

        const productsBase = rows.map((p) => {
            const plain = p.toJSON();
            const mainImg =
                plain.images?.find((img) => img.is_thumbnail)?.image_url ||
                plain.images?.[0]?.image_url ||
                plain.variants?.[0]?.image ||
                plain.image ||
                null;
            return { ...plain, image: mainImg };
        });

        // ====== attach rating + reviewCount ======
        const productIds = productsBase.map((p) => Number(p.product_id));

        let products = productsBase;

        if (productIds.length) {
            const ratingRows = await db.Review.findAll({
                where: { product_id: { [Op.in]: productIds } },
                attributes: [
                    'product_id',
                    [Sequelize.fn('AVG', Sequelize.col('rating')), 'avg_rating'],
                    [Sequelize.fn('COUNT', Sequelize.col('review_id')), 'review_count'],
                ],
                group: ['product_id'],
                raw: true,
            });

            const ratingMap = new Map();
            ratingRows.forEach((r) => {
                ratingMap.set(Number(r.product_id), {
                    rating: Number(r.avg_rating || 0),
                    reviewCount: Number(r.review_count || 0),
                });
            });

            products = productsBase.map((p) => {
                const extra = ratingMap.get(Number(p.product_id)) || { rating: 0, reviewCount: 0 };
                return { ...p, ...extra };
            });
        }

        // facets (category + q only) -> cho sidebar option đầy đủ
        let facetsPayload = undefined;
        if (facets === '1') {
            const brands = await db.Brand.findAll({
                attributes: ['brand_id', 'name', 'slug', 'logo_url', 'origin'],
                include: [
                    {
                        model: db.Product,
                        as: 'products',
                        attributes: [],
                        where: baseWhere,
                        required: true,
                    },
                ],
                group: ['Brand.brand_id'],
                order: [['name', 'ASC']],
                subQuery: false,
            });

            const priceRows = await db.Product.findAll({
                where: baseWhere,
                attributes: ['min_price'],
                raw: true,
            });
            const priceCounts = { 'duoi-15': 0, '15-20': 0, 'tren-20': 0 };
            priceRows.forEach((r) => {
                const p = Number(r.min_price || 0);
                if (p < 15000000) priceCounts['duoi-15'] += 1;
                else if (p >= 15000000 && p <= 20000000) priceCounts['15-20'] += 1;
                else if (p > 20000000) priceCounts['tren-20'] += 1;
            });

            const specRows = await db.Product.findAll({
                where: baseWhere,
                attributes: ['specifications'],
                raw: true,
            });
            const specMap = new Map(); // label -> Set(values)

            specRows.forEach((r) => {
                let specsVal = r.specifications;
                try {
                    if (typeof specsVal === 'string') specsVal = JSON.parse(specsVal || '[]');
                } catch {
                    specsVal = [];
                }

                const arr = Array.isArray(specsVal) ? specsVal : [];
                arr.forEach((it) => {
                    const label = String(it?.label || '').trim();
                    const value = String(it?.value || '').trim();
                    if (!label || !value) return;
                    if (!specMap.has(label)) specMap.set(label, new Set());
                    specMap.get(label).add(value);
                });
            });

            const specsFacet = {};
            for (const [label, set] of specMap.entries()) {
                specsFacet[label] = Array.from(set).sort((a, b) => String(a).localeCompare(String(b), 'vi'));
            }

            facetsPayload = { brands, price_ranges: priceCounts, specs: specsFacet };
        }

        return res.json({
            success: true,
            products,
            meta: { total: count, page: pageNum, limit: limitNum },
            ...(facetsPayload ? { facets: facetsPayload } : {}),
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

// DETAIL BY SLUG
let getDetailProductBySlug = async (req, res) => {
    try {
        const slug = req.params.slug;

        let product = await db.Product.findOne({
            where: { slug },
            include: [
                { model: db.Category, as: 'category' },
                { model: db.Brand, as: 'brand' },
                { model: db.ProductVariant, as: 'variants' },
                { model: db.ProductImage, as: 'images' },
            ],
        });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
        }

        const plain = product.toJSON();

        const agg = await db.Review.findOne({
            where: { product_id: plain.product_id },
            attributes: [
                [Sequelize.fn('AVG', Sequelize.col('rating')), 'avg_rating'],
                [Sequelize.fn('COUNT', Sequelize.col('review_id')), 'review_count'],
            ],
            raw: true,
        });

        plain.rating = Number(agg?.avg_rating || 0);
        plain.reviewCount = Number(agg?.review_count || 0);

        return res.json({ success: true, product: plain });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, message: 'Lỗi tải chi tiết sản phẩm' });
    }
};

// DETAIL BY ID
let getDetailProductById = async (req, res) => {
    try {
        let productId = req.params.id;

        let product = await db.Product.findOne({
            where: { product_id: productId },
            include: [
                { model: db.Category, as: 'category' },
                { model: db.Brand, as: 'brand' },
                { model: db.ProductVariant, as: 'variants' },
            ],
        });

        if (!product) {
            return res.status(404).json({ success: false, message: 'Sản phẩm không tồn tại' });
        }

        return res.json({ success: true, product });
    } catch (e) {
        console.log(e);
        return res.status(500).json({ success: false, message: 'Lỗi tải chi tiết sản phẩm' });
    }
};

// LIST CATEGORIES
export const getCategories = async (req, res) => {
    try {
        const categories = await db.Category.findAll({
            raw: true,
            attributes: ['category_id', 'name', 'slug', 'image'],
            order: [['category_id', 'ASC']],
        });

        return res.json({ success: true, categories });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getRelatedProducts = async (req, res) => {
    try {
        const { brand_slug, exclude_slug, limit = 5 } = req.query;

        if (!brand_slug) return res.json({ success: true, products: [] });

        const brand = await db.Brand.findOne({ where: { slug: brand_slug } });
        if (!brand) return res.json({ success: true, products: [] });

        const limitNum = Math.min(20, Math.max(1, Number(limit) || 5));

        const rows = await db.Product.findAll({
            where: {
                is_active: true,
                brand_id: brand.brand_id,
                ...(exclude_slug ? { slug: { [Op.ne]: exclude_slug } } : {}),
            },
            include: [
                { model: db.Category, as: 'category', attributes: ['name', 'slug', 'image'] },
                { model: db.Brand, as: 'brand', attributes: ['name', 'slug', 'logo_url', 'origin'] },
                { model: db.ProductImage, as: 'images', attributes: ['image_url', 'is_thumbnail'] },
                {
                    model: db.ProductVariant,
                    as: 'variants',
                    attributes: ['variant_id', 'sku', 'price', 'image'],
                    limit: 1,
                    order: [['variant_id', 'ASC']],
                    separate: true,
                },
            ],
            order: [['createdAt', 'DESC']],
            limit: limitNum,
        });

        const dataBase = rows.map((p) => {
            const plain = p.toJSON();
            const mainImg =
                plain.images?.find((img) => img.is_thumbnail)?.image_url ||
                plain.images?.[0]?.image_url ||
                plain.variants?.[0]?.image ||
                plain.image ||
                null;

            return { ...plain, image: mainImg };
        });

        // ===== attach rating + reviewCount cho products related =====
        const productIds = dataBase.map((p) => Number(p.product_id));

        let data = dataBase;

        if (productIds.length) {
            const ratingRows = await db.Review.findAll({
                where: { product_id: { [Op.in]: productIds } },
                attributes: [
                    'product_id',
                    [Sequelize.fn('AVG', Sequelize.col('rating')), 'avg_rating'],
                    [Sequelize.fn('COUNT', Sequelize.col('review_id')), 'review_count'],
                ],
                group: ['product_id'],
                raw: true,
            });

            const ratingMap = new Map();
            ratingRows.forEach((r) => {
                ratingMap.set(Number(r.product_id), {
                    rating: Math.round(Number(r.avg_rating || 0) * 10) / 10,
                    reviewCount: Number(r.review_count || 0),
                });
            });

            data = dataBase.map((p) => {
                const extra = ratingMap.get(Number(p.product_id)) || { rating: 0, reviewCount: 0 };
                return { ...p, ...extra };
            });
        }

        return res.json({ success: true, products: data });

    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getBrands = async (req, res) => {
    try {
        const { category_slug } = req.query;

        const productWhere = { is_active: true };

        if (category_slug) {
            const category = await db.Category.findOne({ where: { slug: category_slug } });
            if (!category) return res.json({ success: true, brands: [] });
            productWhere.category_id = category.category_id;
        }

        const brands = await db.Brand.findAll({
            attributes: ['brand_id', 'name', 'slug', 'logo_url', 'origin'],
            include: [
                {
                    model: db.Product,
                    as: 'products',
                    attributes: [],
                    where: productWhere,
                    required: true,
                },
            ],
            group: ['Brand.brand_id'],
            order: [['name', 'ASC']],
            subQuery: false,
        });

        return res.json({ success: true, brands });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

export default {
    getHomePage,
    getCategories,
    getDetailProductBySlug,
    getDetailProductById,
    getRelatedProducts,
    getBrands,
};
