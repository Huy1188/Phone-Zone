import db from '../models/index';
import bcrypt from 'bcrypt';
import slugify from 'slugify';
import { generateInvoicePdf } from '../utils/invoicePdf';

/**
 * Helpers
 */
const ok = (res, data = null, message = 'OK', meta = null) => res.json({ success: true, message, data, meta });

const fail = (res, status = 400, message = 'Bad Request', errors = null) =>
    res.status(status).json({ success: false, message, errors });

/**
 * Middleware: yêu cầu admin đăng nhập + đúng quyền
 * (Dùng cho các route /api/admin/... trừ login)
 */
let requireAdmin = (req, res, next) => {
    if (!req.session?.isLoggedIn || !req.session?.adminUser) {
        return fail(res, 401, 'Unauthorized');
    }
    if (req.session.adminUser.role_id !== 1) {
        return fail(res, 403, 'Forbidden');
    }
    next();
};

/**
 * ADMIN AUTH
 */

// API check login status (thay cho getAdminLogin render form)
let getAdminLogin = (req, res) => {
    const loggedIn = !!req.session?.isLoggedIn && !!req.session?.adminUser;
    return ok(
        res,
        {
            loggedIn,
            adminUser: loggedIn ? req.session.adminUser : null,
        },
        'Admin auth status',
    );
};

let handleAdminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        if (!email || !password) return fail(res, 400, 'Thiếu email hoặc password');

        const user = await db.User.findOne({
            where: { email },
            raw: true,
        });

        if (!user) return fail(res, 400, 'Email này chưa được đăng ký trong hệ thống!');

        const passOk = bcrypt.compareSync(password, user.password);
        if (!passOk) return fail(res, 400, 'Mật khẩu không chính xác!');

        if (user.role_id !== 1) return fail(res, 403, 'Tài khoản này không có quyền Quản trị!');

        req.session.isLoggedIn = true;
        req.session.adminUser = user;

        return ok(
            res,
            {
                adminUser: { user_id: user.user_id, email: user.email, role_id: user.role_id },
            },
            'Đăng nhập admin thành công',
        );
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi Server, vui lòng thử lại sau!');
    }
};

// Middleware cũ (để tương thích nếu routes bạn đang gọi tên này)
let checkLoggedIn = requireAdmin;

let handleLogout = (req, res) => {
    req.session.destroy(() => {
        return ok(res, {}, 'Đã đăng xuất');
    });
};

// API đổi mật khẩu (không cần getChangePassword render form)
let getChangePassword = (req, res) => {
    return ok(res, {}, 'Ready');
};

let handleChangePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword, confirmPassword } = req.body;

        const adminUser = req.session.adminUser;
        if (!adminUser) return fail(res, 401, 'Unauthorized');

        const user = await db.User.findOne({ where: { user_id: adminUser.user_id } });
        if (!user) return fail(res, 404, 'Người dùng không tồn tại trong DB!');

        const match = await bcrypt.compare(currentPassword, user.password);
        if (!match) return fail(res, 400, 'Mật khẩu hiện tại không đúng!');

        if (newPassword !== confirmPassword) return fail(res, 400, 'Mật khẩu xác nhận không khớp!');

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(newPassword, salt);

        await db.User.update({ password: hashPassword }, { where: { user_id: adminUser.user_id } });

        return ok(res, {}, 'Đổi mật khẩu thành công!');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Có lỗi xảy ra: ' + e);
    }
};

// Giữ lại hàm này nếu nơi khác còn dùng
let checkUserEmail = async (userEmail) => {
    const user = await db.User.findOne({ where: { email: userEmail } });
    return !!user;
};

/**
 * USER CRUD
 */
let handleCreateUser = async (req, res) => {
    try {
        const { email, password, first_name, last_name, phone, gender, role_id } = req.body;

        if (!email || !password || !first_name || !last_name) {
            return fail(res, 400, 'Thiếu thông tin bắt buộc (email, password, first_name, last_name)');
        }

        // check email tồn tại
        const existed = await db.User.findOne({ where: { email } });
        if (existed) return fail(res, 400, 'Email đã tồn tại trong hệ thống!');

        // hash password
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(password, salt);

        const user = await db.User.create({
            email,
            password: hashPassword,
            first_name,
            last_name,
            phone: phone || null,
            gender: gender === true || gender === 'true' || gender === 1 || gender === '1', // boolean
            role_id: Number(role_id || 2), // mặc định user
        });

        // không trả password
        const data = {
            user_id: user.user_id,
            email: user.email,
            first_name: user.first_name,
            last_name: user.last_name,
            phone: user.phone,
            gender: user.gender,
            role_id: user.role_id,
            createdAt: user.createdAt,
        };

        return ok(res, { user: data }, 'Tạo người dùng thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi tạo người dùng: ' + e);
    }
};

let handleDeleteUser = async (req, res) => {
    try {
        const id = req.params.userId;
        if (!id) return fail(res, 400, 'Thiếu user_id');

        await db.User.destroy({ where: { user_id: id } });
        return ok(res, {}, 'Xóa thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi xóa user: ' + e);
    }
};

let getEditUser = async (req, res) => {
    try {
        const userId = req.params.userId;
        if (!userId) return fail(res, 400, 'Thiếu user_id');

        const userData = await db.User.findOne({
            where: { user_id: userId },
            include: [{ model: db.Address, as: 'addresses' }],
            raw: false,
            nest: true,
        });

        if (!userData) return fail(res, 404, 'User not found!');

        return ok(res, { user: userData.toJSON() }, 'User detail');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi lấy user: ' + e);
    }
};

let putCRUD = async (req, res) => {
    const data = req.body;
    const userId = req.params.userId;

    try {
        if (!userId) return fail(res, 400, 'Thiếu user_id');

        // 1) Update user
        await db.User.update(
            {
                first_name: data.first_name,
                last_name: data.last_name,
                phone: data.phone,
            },
            { where: { user_id: userId } },
        );

        // 2) Update default address
        if (data.selected_default_id) {
            await db.Address.update({ is_default: false }, { where: { user_id: userId } });
            await db.Address.update({ is_default: true }, { where: { address_id: data.selected_default_id } });
        }

        // 3) Update existing addresses
        if (data.addresses) {
            for (let addrId in data.addresses) {
                let addrData = data.addresses[addrId];

                await db.Address.update(
                    {
                        recipient_name: addrData.recipient_name,
                        recipient_phone: addrData.recipient_phone,
                        street: addrData.street,
                        city: addrData.city,
                    },
                    { where: { address_id: addrId } },
                );
            }
        }

        // 4) Create new address (optional)
        if (data.new_street && data.new_street.trim() !== '') {
            await db.Address.create({
                user_id: userId,
                street: data.new_street,
                city: data.new_city,
                recipient_name: (data.first_name || '') + ' ' + (data.last_name || ''),
                recipient_phone: data.phone || '0000000000',
                is_default: false,
            });
        }

        return ok(res, {}, 'Cập nhật user thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi update: ' + e);
    }
};

let handleUserManage = async (req, res) => {
    try {
        let users = await db.User.findAll({
            order: [
                ['role_id', 'ASC'],
                ['createdAt', 'DESC'],
            ],
            include: [{ model: db.Address, as: 'addresses' }],
            raw: false,
            nest: true,
        });

        let processedUsers = users.map((user) => {
            let u = user.toJSON();

            let addrStr = 'Chưa cập nhật';
            let isDefault = false;

            if (u.addresses && u.addresses.length > 0) {
                let found = u.addresses.find((a) => a.is_default == true || a.is_default == 1);
                if (!found) found = u.addresses[0];
                else isDefault = true;

                addrStr = `${found.street}, ${found.city}`;
            }

            u.displayAddress = addrStr;
            u.isDefaultAddress = isDefault;
            return u;
        });

        return ok(res, { users: processedUsers }, 'Danh sách users');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi lấy danh sách user: ' + e);
    }
};

// Address
let handleDeleteAddress = async (req, res) => {
    try {
        let addressId = req.params.addressId;
        if (!addressId) return fail(res, 400, 'Thiếu address id');

        await db.Address.destroy({ where: { address_id: addressId } });
        return ok(res, {}, 'Xóa địa chỉ thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi xóa địa chỉ: ' + e);
    }
};

/**
 * CATEGORY
 */
let handleCategoryManage = async (req, res) => {
    try {
        let categories = await db.Category.findAll({ raw: true });
        return ok(res, { categories }, 'Danh sách danh mục');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi lấy danh sách danh mục!');
    }
};

let getCreateCategory = async (req, res) => {
    return ok(res, {}, 'Ready');
};

let handleCreateCategory = async (req, res) => {
    let data = req.body;

    try {
        let imagePath = '';
        if (req.file) imagePath = '/images/products/' + req.file.filename;

        let slug = slugify(data.name, { lower: true, locale: 'vi', strict: true });

        let category = await db.Category.create({
            name: data.name,
            image: imagePath,
            slug,
        });

        return ok(res, { category }, 'Tạo danh mục thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi tạo danh mục: ' + e);
    }
};

let handleDeleteCategory = async (req, res) => {
    try {
        let id = req.params.categoryId;
        if (!id) return fail(res, 400, 'Thiếu category id');

        await db.Category.destroy({ where: { category_id: id } });
        return ok(res, {}, 'Xóa danh mục thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi xóa danh mục: ' + e);
    }
};

let getEditCategory = async (req, res) => {
    try {
        let id = req.params.categoryId;
        if (!id) return fail(res, 400, 'Thiếu category id');

        let category = await db.Category.findOne({
            where: { category_id: id },
            raw: true,
        });

        if (!category) return fail(res, 404, 'Không tìm thấy danh mục!');
        return ok(res, { category }, 'Category detail');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi: ' + e);
    }
};

let handleUpdateCategory = async (req, res) => {
    let data = req.body;
    let id = req.params.categoryId;

    try {
        if (!id) return fail(res, 400, 'Thiếu category_id');

        let updateData = {
            name: data.name,
            slug: slugify(data.name, { lower: true, locale: 'vi' }),
        };

        if (req.file) updateData.image = '/images/products/' + req.file.filename;

        await db.Category.update(updateData, { where: { category_id: id } });

        const category = await db.Category.findOne({ where: { category_id: id }, raw: true });
        return ok(res, { category }, 'Cập nhật danh mục thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi cập nhật: ' + e);
    }
};

/**
 * BRAND
 */
let handleBrandManage = async (req, res) => {
    try {
        let brands = await db.Brand.findAll({ raw: true });
        return ok(res, { brands }, 'Danh sách thương hiệu');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi lấy danh sách thương hiệu!');
    }
};

let getCreateBrand = async (req, res) => {
    return ok(res, {}, 'Ready');
};

let handleCreateBrand = async (req, res) => {
    let data = req.body;
    try {
        let logoPath = '';
        if (req.file) logoPath = '/images/products/' + req.file.filename;

        let finalSlug = '';
        if (data.slug && data.slug.trim() !== '') finalSlug = slugify(data.slug, { lower: true, locale: 'vi' });
        else finalSlug = slugify(data.name, { lower: true, locale: 'vi' });

        let brand = await db.Brand.create({
            name: data.name,
            slug: finalSlug,
            logo_url: logoPath,
            origin: data.origin,
        });

        return ok(res, { brand }, 'Tạo thương hiệu thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi tạo thương hiệu: ' + e);
    }
};

let getEditBrand = async (req, res) => {
    try {
        let id = req.params.brandId;
        if (!id) return fail(res, 400, 'Thiếu brand id');

        let brand = await db.Brand.findOne({
            where: { brand_id: id },
            raw: true,
        });
        if (!brand) return fail(res, 404, 'Không tìm thấy thương hiệu!');

        return ok(res, { brand }, 'Brand detail');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi: ' + e);
    }
};

let handleUpdateBrand = async (req, res) => {
    let data = req.body;
    let id = req.params.brandId;

    try {
        if (!id) return fail(res, 400, 'Thiếu brand_id');

        let finalSlug = '';
        if (data.slug && data.slug.trim() !== '') finalSlug = slugify(data.slug, { lower: true, locale: 'vi' });
        else finalSlug = slugify(data.name, { lower: true, locale: 'vi' });

        let updateData = {
            name: data.name,
            slug: finalSlug,
            origin: data.origin,
        };

        if (req.file) updateData.logo_url = '/images/products/' + req.file.filename;

        await db.Brand.update(updateData, { where: { brand_id: id } });

        const brand = await db.Brand.findOne({ where: { brand_id: id }, raw: true });
        return ok(res, { brand }, 'Cập nhật thương hiệu thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi cập nhật: ' + e);
    }
};

let handleDeleteBrand = async (req, res) => {
    try {
        let id = req.params.brandId;
        if (!id) return fail(res, 400, 'Thiếu brand id');

        await db.Brand.destroy({ where: { brand_id: id } });
        return ok(res, {}, 'Xóa thương hiệu thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi xóa: ' + e);
    }
};

/**
 * PRODUCT (quản lý)
 */
let handleProductManage = async (req, res) => {
    try {
        let page = req.query.page ? parseInt(req.query.page) : 1;
        let limit = req.query.limit ? parseInt(req.query.limit) : 8;
        let offset = (page - 1) * limit;

        let whereCondition = {};

        if (req.query.category_id && req.query.category_id !== '') whereCondition.category_id = req.query.category_id;
        if (req.query.brand_id && req.query.brand_id !== '') whereCondition.brand_id = req.query.brand_id;

        let { count, rows: products } = await db.Product.findAndCountAll({
            where: whereCondition,
            limit,
            offset,
            order: [['createdAt', 'DESC']],
            include: [
                { model: db.Category, as: 'category', attributes: ['name'] },
                { model: db.Brand, as: 'brand', attributes: ['name'] },
            ],
            raw: true,
            nest: true,
        });

        let categories = await db.Category.findAll({ raw: true });
        let brands = await db.Brand.findAll({ raw: true });

        let totalPages = Math.ceil(count / limit);

        return ok(
            res,
            {
                products,
                categories,
                brands,
                paging: { page, limit, totalItems: count, totalPages },
                currentFilter: req.query,
            },
            'Danh sách sản phẩm',
        );
    } catch (e) {
        console.log('Lỗi Product Manage:', e);
        return fail(res, 500, 'Lỗi: ' + e);
    }
};

let getCreateProduct = async (req, res) => {
    try {
        let categories = await db.Category.findAll({ raw: true });
        let brands = await db.Brand.findAll({ raw: true });
        return ok(res, { categories, brands }, 'Data tạo sản phẩm');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi tải data tạo sản phẩm: ' + e);
    }
};

let handleCreateProduct = async (req, res) => {
    let data = req.body;
    try {
        let imagePath = '';
        if (req.file) imagePath = '/images/products/' + req.file.filename;

        let slug = slugify(data.name, { lower: true, locale: 'vi', strict: true });

        let newProduct = await db.Product.create({
            name: data.name,
            slug,
            min_price: data.min_price,
            description: data.description,
            category_id: data.category_id,
            brand_id: data.brand_id,
            image: imagePath,
            is_active: true,
            is_hot: false,
        });

        return ok(res, { product: newProduct }, 'Tạo sản phẩm thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi tạo sản phẩm: ' + e);
    }
};

let getEditProduct = async (req, res) => {
    let productId = req.params.productId;
    try {
        if (!productId) return fail(res, 400, 'Thiếu product id');

        let product = await db.Product.findOne({
            where: { product_id: productId },
            include: [{ model: db.ProductVariant, as: 'variants' }],
            raw: false,
        });

        if (!product) return fail(res, 404, 'Sản phẩm không tồn tại!');

        let categories = await db.Category.findAll({ raw: true });
        let brands = await db.Brand.findAll({ raw: true });

        return ok(
            res,
            {
                product: product.toJSON ? product.toJSON() : product,
                categories,
                brands,
            },
            'Data sửa sản phẩm',
        );
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi tải trang sửa sản phẩm');
    }
};

let handleUpdateProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        if (!productId) return fail(res, 400, 'Thiếu productId');

        const data = req.body;

        const updateData = {
            name: data.name,
            min_price: data.min_price,
            description: data.description,
            category_id: data.category_id,
            brand_id: data.brand_id,
        };

        if (req.file) updateData.image = '/images/products/' + req.file.filename;

        if (data.name) {
            updateData.slug = slugify(data.name, { lower: true, locale: 'vi', strict: true });
        }

        await db.Product.update(updateData, { where: { product_id: productId } });

        const product = await db.Product.findOne({ where: { product_id: productId }, raw: true });
        return ok(res, { product }, 'Cập nhật sản phẩm thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi cập nhật sản phẩm: ' + e);
    }
};

let handleDeleteProduct = async (req, res) => {
    try {
        const productId = req.params.productId;
        if (!productId) return fail(res, 400, 'Thiếu productId');

        await db.ProductVariant.destroy({ where: { product_id: productId } }); // tránh rác
        await db.Product.destroy({ where: { product_id: productId } });

        return ok(res, {}, 'Xóa sản phẩm thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi xóa sản phẩm: ' + e);
    }
};

let handleAddVariant = async (req, res) => {
    let data = req.body;
    const product_id = req.params.productId;

    try {
        if (!product_id) return fail(res, 400, 'Thiếu productId');

        let variant = await db.ProductVariant.create({
            product_id,
            sku: data.sku,
            color: data.color,
            ram: data.ram,
            rom: data.rom,
            price: data.price,
            stock: data.stock,
            image: data.image,
        });

        return ok(res, { variant }, 'Thêm biến thể thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi thêm biến thể: ' + e);
    }
};

let handleDeleteVariant = async (req, res) => {
    let variantId = req.params.variantId;

    try {
        if (!variantId) return fail(res, 400, 'Thiếu variant id');

        await db.ProductVariant.destroy({ where: { variant_id: variantId } });
        return ok(res, {}, 'Xóa biến thể thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi xóa biến thể');
    }
};

/**
 * ORDER (admin)
 */
let handleOrderManage = async (req, res) => {
    try {
        let orders = await db.Order.findAll({
            order: [['createdAt', 'DESC']],
            include: [
                {
                    model: db.User,
                    as: 'user',
                    attributes: ['first_name', 'last_name', 'email'],
                },
            ],
            raw: true,
            nest: true,
        });

        return ok(res, { orders }, 'Danh sách đơn hàng');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi lấy danh sách đơn hàng: ' + e);
    }
};

// adminController.js
// giả sử bạn đang có helper ok/fail giống project bạn
// ok(res, data, message) / fail(res, code, message)

const getOrderDetail = async (req, res) => {
    try {
        const orderId = Number(req.params.orderId || req.params.id);
        if (!orderId) return fail(res, 400, 'Thiếu order id');

        // 1) Lấy order + user + addresses (giữ logic cũ của bạn nếu khác)
        const order = await db.Order.findOne({
            where: { order_id: orderId },
            include: [
                {
                    model: db.User,
                    as: 'user',
                    include: [{ model: db.Address, as: 'addresses' }],
                },
            ],
            raw: false,
            nest: true,
        });

        if (!order) return fail(res, 404, 'Không tìm thấy đơn hàng');

        // 2) Lấy orderDetails + variant + product
        const orderDetails = await db.OrderDetail.findAll({
            where: { order_id: orderId },
            include: [
                {
                    model: db.ProductVariant,
                    as: 'variant', // ✅ đúng alias theo model :contentReference[oaicite:4]{index=4}
                    attributes: ['variant_id', 'product_id', 'sku', 'color', 'ram', 'rom', 'image', 'price'],
                    include: [
                        {
                            model: db.Product,
                            as: 'product', // ✅ đúng alias theo model :contentReference[oaicite:5]{index=5}
                            attributes: ['product_id', 'name', 'image'],
                        },
                    ],
                },
            ],
            raw: false,
            nest: true,
        });

        // 3) Normalize output: luôn có variant_label để FE hiển thị phân loại
        const normalized = orderDetails.map((d) => {
            const x = d.toJSON ? d.toJSON() : d;
            const v = x.variant || null;

            const parts = [];
            if (v?.color) parts.push(v.color);
            if (v?.rom) parts.push(v.rom);
            // nếu bạn muốn thêm RAM vào label
            // if (v?.ram) parts.push(v.ram);

            const variant_label = parts.join(' - ') || v?.sku || '';

            return {
                detail_id: x.detail_id,
                order_id: x.order_id,
                variant_id: x.variant_id,

                // snapshot từ OrderDetail (giữ đúng DB bạn đang có) :contentReference[oaicite:6]{index=6}
                product_name: x.product_name,
                quantity: Number(x.quantity || 0),
                price: Number(x.price || 0),

                variant: v,
                variant_label,
            };
        });

        return ok(
            res,
            {
                order: order.toJSON ? order.toJSON() : order,
                orderDetails: normalized,
            },
            'Chi tiết đơn hàng',
        );
    } catch (e) {
        console.error(e);
        return fail(res, 500, 'Lỗi hệ thống');
    }
};

const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowStatus = ['pending', 'shipping', 'delivered', 'cancelled'];
        if (!allowStatus.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái đơn hàng không hợp lệ',
            });
        }

        const order = await db.Order.findByPk(id);
        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Không tìm thấy đơn hàng',
            });
        }

        order.status = status;
        await order.save();

        return res.json({
            success: true,
            message: 'Cập nhật trạng thái đơn hàng thành công',
            data: { order_id: order.order_id, status: order.status },
        });
    } catch (error) {
        console.error('updateOrderStatus error:', error);
        return res.status(500).json({
            success: false,
            message: 'Lỗi server',
        });
    }
};

const exportOrderInvoice = async (req, res) => {
    try {
        const orderId = req.params.id;

        const order = await db.Order.findOne({
            where: { order_id: orderId },
            include: [
                { model: db.User, as: 'user' },
                {
                    model: db.OrderDetail,
                    as: 'details',
                    // ✅ lấy luôn product_name/price/quantity từ order detail
                    attributes: ['detail_id', 'product_name', 'price', 'quantity', 'variant_id', 'order_id'],
                    include: [
                        {
                            model: db.ProductVariant,
                            as: 'variant',
                            include: [
                                {
                                    model: db.Product,
                                    as: 'product', // ✅ đúng alias bạn đang dùng ở getOrderDetail
                                    attributes: ['product_id', 'name'],
                                },
                            ],
                        },
                    ],
                },
            ],
        });

        if (!order) {
            return res.status(404).json({ success: false, message: 'Khong tim thay don hang' });
        }

        return generateInvoicePdf(res, {
            order,
            user: order.user,
            details: order.details || [],
        });
    } catch (e) {
        console.error(e);
        return res.status(500).json({ success: false, message: 'Loi xuat hoa don' });
    }
};

let handleDeleteOrder = async (req, res) => {
    try {
        const orderId = req.params.orderId;
        if (!orderId) return fail(res, 400, 'Thiếu orderId');

        await db.OrderDetail.destroy({ where: { order_id: orderId } });
        await db.Order.destroy({ where: { order_id: orderId } });

        return ok(res, {}, 'Đã xóa đơn hàng');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi xóa đơn: ' + e);
    }
};

/**
 * VOUCHER
 */
let handleVoucherManage = async (req, res) => {
    try {
        let vouchers = await db.Voucher.findAll({
            raw: true,
            order: [['createdAt', 'DESC']],
        });
        return ok(res, { vouchers }, 'Danh sách voucher');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi: ' + e);
    }
};

let getCreateVoucher = (req, res) => ok(res, {}, 'Ready');

let handleStoreVoucher = async (req, res) => {
    let data = req.body;
    try {
        let voucher = await db.Voucher.create({
            code: (data.code || '').toUpperCase(),
            discount_type: data.discount_type,
            discount_value: data.discount_value,
            min_order_value: data.min_order_value,
            quantity: data.quantity,
            start_date: data.start_date,
            end_date: data.end_date,
        });
        return ok(res, { voucher }, 'Tạo voucher thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi tạo voucher: ' + e);
    }
};

let getEditVoucher = async (req, res) => {
    try {
        let id = req.params.voucherId;
        if (!id) return fail(res, 400, 'Thiếu voucherId');

        let voucher = await db.Voucher.findOne({ where: { voucher_id: id }, raw: true });
        if (!voucher) return fail(res, 404, 'Không tìm thấy voucher!');

        return ok(res, { voucher }, 'Voucher detail');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi: ' + e);
    }
};

let handleUpdateVoucher = async (req, res) => {
    let data = req.body;
    const id = req.params.voucherId;

    try {
        if (!id) return fail(res, 400, 'Thiếu voucherId');

        await db.Voucher.update(
            {
                code: (data.code || '').toUpperCase(),
                discount_type: data.discount_type,
                discount_value: data.discount_value,
                min_order_value: data.min_order_value,
                quantity: data.quantity,
                start_date: data.start_date,
                end_date: data.end_date,
            },
            { where: { voucher_id: id } },
        );

        const voucher = await db.Voucher.findOne({ where: { voucher_id: id }, raw: true });
        return ok(res, { voucher }, 'Cập nhật voucher thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi update: ' + e);
    }
};

let handleDeleteVoucher = async (req, res) => {
    try {
        let id = req.params.voucherId;
        if (!id) return fail(res, 400, 'Thiếu voucherId');

        await db.Voucher.destroy({ where: { voucher_id: id } });
        return ok(res, {}, 'Xóa voucher thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi xóa: ' + e);
    }
};

/**
 * REVIEW
 */
let handleReviewManage = async (req, res) => {
    try {
        let reviews = await db.Review.findAll({
            include: [
                { model: db.User, as: 'user', attributes: ['first_name', 'last_name', 'email'] },
                { model: db.Product, as: 'product', attributes: ['name'] },
            ],
            raw: false,
            nest: true,
            order: [['createdAt', 'DESC']],
        });

        const items = reviews.map((r) => (r.toJSON ? r.toJSON() : r));
        return ok(res, { reviews: items }, 'Danh sách review');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi lấy danh sách đánh giá: ' + e);
    }
};

let handleDeleteReview = async (req, res) => {
    try {
        let id = req.params.reviewId;
        if (!id) return fail(res, 400, 'Thiếu reviewId');

        await db.Review.destroy({ where: { review_id: id } });
        return ok(res, {}, 'Xóa review thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi xóa review: ' + e);
    }
};

/**
 * POST
 */
let handlePostManage = async (req, res) => {
    try {
        let posts = await db.Post.findAll({
            include: [{ model: db.User, as: 'author', attributes: ['first_name', 'last_name'] }],
            raw: true,
            nest: true,
        });
        return ok(res, { posts }, 'Danh sách bài viết');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi: ' + e);
    }
};

let getCreatePost = async (req, res) => {
    try {
        let categories = await db.PostCategory.findAll({ raw: true });
        let products = await db.Product.findAll({ attributes: ['product_id', 'name'], raw: true });

        return ok(res, { categories, products }, 'Data tạo bài viết');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi tải data tạo bài viết: ' + e);
    }
};

let handleStorePost = async (req, res) => {
    let data = req.body;
    try {
        let thumbnailPath = '';
        if (req.file) thumbnailPath = '/images/products/' + req.file.filename;

        let post = await db.Post.create({
            title: data.title,
            slug: slugify(data.title, { lower: true, locale: 'vi' }),
            content: data.content,
            thumbnail: thumbnailPath,
            user_id: req.session.adminUser ? req.session.adminUser.user_id : 1,
            post_category_id: data.post_category_id,
            product_id: data.product_id ? data.product_id : null,
        });

        return ok(res, { post }, 'Tạo bài viết thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi lưu bài viết: ' + e);
    }
};

let handleDeletePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        if (!postId) return fail(res, 400, 'Thiếu postId');

        await db.Post.destroy({ where: { post_id: postId } });
        return ok(res, {}, 'Xóa bài viết thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi xóa bài viết: ' + e);
    }
};

let getEditPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        if (!postId) return fail(res, 400, 'Thiếu postId');

        const post = await db.Post.findOne({ where: { post_id: postId }, raw: true });
        if (!post) return fail(res, 404, 'Bài viết không tồn tại');

        return ok(res, { post }, 'Post detail');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi lấy post: ' + e);
    }
};

let handleUpdatePost = async (req, res) => {
    try {
        const postId = req.params.postId;
        if (!postId) return fail(res, 400, 'Thiếu postId');

        const data = req.body;

        const updateData = {
            title: data.title,
            content: data.content,
            post_category_id: data.post_category_id,
            product_id: data.product_id || null,
        };

        if (data.title) {
            updateData.slug = slugify(data.title, { lower: true, locale: 'vi' });
        }

        if (req.file) updateData.thumbnail = '/images/products/' + req.file.filename;

        await db.Post.update(updateData, { where: { post_id: postId } });

        const post = await db.Post.findOne({ where: { post_id: postId }, raw: true });
        return ok(res, { post }, 'Cập nhật bài viết thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi update post: ' + e);
    }
};

/**
 * INVOICE (API-only -> trả data, FE tự render/in PDF)
 */
let printInvoice = async (req, res) => {
    try {
        let orderId = req.params.orderId;
        if (!orderId) return fail(res, 400, 'Thiếu order id');

        let order = await db.Order.findOne({ where: { order_id: orderId }, raw: true });
        if (!order) return fail(res, 404, 'Không tìm thấy đơn hàng');

        let orderDetails = await db.OrderDetail.findAll({ where: { order_id: orderId }, raw: true });

        return ok(res, { order, orderDetails }, 'Invoice data');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi in hóa đơn: ' + e);
    }
};

/**
 * DASHBOARD
 */
let getAdminDashboard = async (req, res) => {
    try {
        let userCount = await db.User.count({ where: { role_id: 2 } });
        let postCount = await db.Post.count();
        let productCount = await db.Product.count();
        let orderCount = await db.Order.count();

        return ok(res, { userCount, postCount, productCount, orderCount }, 'Dashboard data');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi Dashboard: ' + e);
    }
};

/**
 * BANNER
 */
let handleBannerManage = async (req, res) => {
    try {
        const banners = await db.Banner.findAll({
            raw: true,
            order: [['createdAt', 'DESC']],
        });
        return ok(res, { banners }, 'Danh sách banner');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi lấy danh sách banner!');
    }
};

let getEditBanner = async (req, res) => {
    try {
        const id = req.params.bannerId;
        if (!id) return fail(res, 400, 'Thiếu bannerId');

        const banner = await db.Banner.findOne({
            where: { banner_id: id },
            raw: true,
        });

        if (!banner) return fail(res, 404, 'Không tìm thấy banner!');
        return ok(res, { banner }, 'Banner detail');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi: ' + e);
    }
};

let handleCreateBanner = async (req, res) => {
    try {
        const data = req.body;

        let imagePath = '';
        if (req.file) imagePath = '/images/products/' + req.file.filename;

        const banner = await db.Banner.create({
            title: data.title || '',
            link: data.link || '',
            image: imagePath,
            is_active:
                data.is_active === true || data.is_active === 'true' || data.is_active === 1 || data.is_active === '1',
        });

        return ok(res, { banner }, 'Tạo banner thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi tạo banner: ' + e);
    }
};

let handleUpdateBanner = async (req, res) => {
    try {
        const id = req.params.bannerId;
        if (!id) return fail(res, 400, 'Thiếu bannerId');

        const data = req.body;

        const updateData = {
            title: data.title,
            link: data.link,
            is_active:
                data.is_active === true || data.is_active === 'true' || data.is_active === 1 || data.is_active === '1',
        };

        if (req.file) updateData.image = '/images/products/' + req.file.filename;

        await db.Banner.update(updateData, { where: { banner_id: id } });

        const banner = await db.Banner.findOne({
            where: { banner_id: id },
            raw: true,
        });

        return ok(res, { banner }, 'Cập nhật banner thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi cập nhật banner: ' + e);
    }
};

let handleDeleteBanner = async (req, res) => {
    try {
        const id = req.params.bannerId;
        if (!id) return fail(res, 400, 'Thiếu bannerId');

        await db.Banner.destroy({ where: { banner_id: id } });
        return ok(res, {}, 'Xóa banner thành công');
    } catch (e) {
        console.log(e);
        return fail(res, 500, 'Lỗi xóa banner: ' + e);
    }
};

export default {
    // middleware
    requireAdmin,
    checkLoggedIn,

    // auth
    getAdminLogin,
    handleAdminLogin,
    handleLogout,
    checkUserEmail,
    getChangePassword,
    handleChangePassword,

    // user
    handleDeleteUser,
    handleCreateUser,
    getEditUser,
    putCRUD,
    handleUserManage,
    handleDeleteAddress,

    // category
    handleCategoryManage,
    getCreateCategory,
    handleCreateCategory,
    handleDeleteCategory,
    getEditCategory,
    handleUpdateCategory,

    // brand
    handleBrandManage,
    getCreateBrand,
    handleCreateBrand,
    getEditBrand,
    handleUpdateBrand,
    handleDeleteBrand,

    // product
    handleProductManage,
    getCreateProduct,
    handleCreateProduct,
    handleUpdateProduct,
    handleDeleteProduct,
    getEditProduct,
    handleAddVariant,
    handleDeleteVariant,

    // order
    handleOrderManage,
    getOrderDetail,
    updateOrderStatus,
    handleDeleteOrder,
    exportOrderInvoice,

    // voucher
    handleVoucherManage,
    getCreateVoucher,
    handleStoreVoucher,
    getEditVoucher,
    handleUpdateVoucher,
    handleDeleteVoucher,

    // review
    handleReviewManage,
    handleDeleteReview,

    // post
    handlePostManage,
    getCreatePost,
    handleStorePost,
    handleDeletePost,
    handleUpdatePost,
    getEditPost,

    // invoice
    printInvoice,

    // dashboard
    getAdminDashboard,

    // banner
    handleBannerManage,
    getEditBanner,
    handleCreateBanner,
    handleUpdateBanner,
    handleDeleteBanner,
};
