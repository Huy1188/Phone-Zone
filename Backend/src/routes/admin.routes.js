import express from "express";

import adminController from "../controllers/adminController";
import upload from "../config/multerConfig";

const router = express.Router();

/**
 * ============== ADMIN (API JSON) ==============
 * Admin UI sẽ chuyển sang Next.js.
 * Backend chỉ giữ API + session.
 */

// Admin auth
router.get("/admin/auth", adminController.getAdminLogin);
router.post("/admin/login", adminController.handleAdminLogin);
router.post("/admin/logout", adminController.handleLogout);
router.post(
  "/admin/change-password",
  adminController.checkLoggedIn,
  adminController.handleChangePassword
);

// Dashboard
router.get(
  "/admin/dashboard",
  adminController.checkLoggedIn,
  adminController.getAdminDashboard
);

// Users
router.get(
  "/admin/users",
  adminController.checkLoggedIn,
  adminController.handleUserManage
);
router.post(
  "/admin/users",
  adminController.checkLoggedIn,
  adminController.handleCreateUser
);

router.get(
  "/admin/users/:userId",
  adminController.checkLoggedIn,
  adminController.getEditUser
);
router.patch(
  "/admin/users/:userId",
  adminController.checkLoggedIn,
  adminController.putCRUD
);
router.delete(
  "/admin/users/:userId",
  adminController.checkLoggedIn,
  adminController.handleDeleteUser
);

// Addresses
router.delete(
  "/admin/addresses/:addressId",
  adminController.checkLoggedIn,
  adminController.handleDeleteAddress
);

// Categories
router.get(
  "/admin/categories",
  adminController.checkLoggedIn,
  adminController.handleCategoryManage
);
router.get(
  "/admin/categories/create",
  adminController.checkLoggedIn,
  adminController.getCreateCategory
);
router.post(
  "/admin/categories",
  adminController.checkLoggedIn,
  upload.single("image"),
  adminController.handleCreateCategory
);
router.get(
  "/admin/categories/:categoryId",
  adminController.checkLoggedIn,
  adminController.getEditCategory
);
router.patch(
  "/admin/categories/:categoryId",
  adminController.checkLoggedIn,
  upload.single("image"),
  adminController.handleUpdateCategory
);
router.delete(
  "/admin/categories/:categoryId",
  adminController.checkLoggedIn,
  adminController.handleDeleteCategory
);

// Brands
router.get(
  "/admin/brands",
  adminController.checkLoggedIn,
  adminController.handleBrandManage
);
router.get(
  "/admin/brands/create",
  adminController.checkLoggedIn,
  adminController.getCreateBrand
);
router.post(
  "/admin/brands",
  adminController.checkLoggedIn,
  upload.single("image"),
  adminController.handleCreateBrand
);
router.get(
  "/admin/brands/:brandId",
  adminController.checkLoggedIn,
  adminController.getEditBrand
);
router.patch(
  "/admin/brands/:brandId",
  adminController.checkLoggedIn,
  upload.single("image"),
  adminController.handleUpdateBrand
);
router.delete(
  "/admin/brands/:brandId",
  adminController.checkLoggedIn,
  adminController.handleDeleteBrand
);

// Products
router.get(
  "/admin/products",
  adminController.checkLoggedIn,
  adminController.handleProductManage
);
router.get(
  "/admin/products/create",
  adminController.checkLoggedIn,
  adminController.getCreateProduct
);
router.post(
  "/admin/products",
  adminController.checkLoggedIn,
  upload.single("image"),
  adminController.handleCreateProduct
);
router.get(
  "/admin/products/:productId",
  adminController.checkLoggedIn,
  adminController.getEditProduct
);

router.patch(
  "/admin/products/:productId",
  adminController.checkLoggedIn,
  upload.single("image"),
  adminController.handleUpdateProduct
);

router.delete(
  "/admin/products/:productId",
  adminController.checkLoggedIn,
  adminController.handleDeleteProduct
);


// Variants
router.post(
  "/admin/products/:productId/variants",
  adminController.checkLoggedIn,
  upload.single("image"),
  adminController.handleAddVariant
);
router.delete(
  "/admin/variants/:variantId",
  adminController.checkLoggedIn,
  adminController.handleDeleteVariant
);

// Orders
router.get(
  "/admin/orders",
  adminController.checkLoggedIn,
  adminController.handleOrderManage
);
router.get(
  "/admin/orders/:orderId",
  adminController.checkLoggedIn,
  adminController.getOrderDetail
);

router.patch(
  "/admin/orders/:id/status",
  adminController.checkLoggedIn,
  adminController.updateOrderStatus
);


router.delete(
  "/admin/orders/:orderId",
  adminController.checkLoggedIn,
  adminController.handleDeleteOrder
);

router.get(
  "/admin/orders/:id/invoice",
  adminController.checkLoggedIn,
  adminController.exportOrderInvoice
);



// Vouchers
router.get(
  "/admin/vouchers",
  adminController.checkLoggedIn,
  adminController.handleVoucherManage
);
router.get(
  "/admin/vouchers/create",
  adminController.checkLoggedIn,
  adminController.getCreateVoucher
);
router.post(
  "/admin/vouchers",
  adminController.checkLoggedIn,
  adminController.handleStoreVoucher
);
router.get(
  "/admin/vouchers/:voucherId",
  adminController.checkLoggedIn,
  adminController.getEditVoucher
);
router.patch(
  "/admin/vouchers/:voucherId",
  adminController.checkLoggedIn,
  adminController.handleUpdateVoucher
);
router.delete(
  "/admin/vouchers/:voucherId",
  adminController.checkLoggedIn,
  adminController.handleDeleteVoucher
);

// Reviews
router.get(
  "/admin/reviews",
  adminController.checkLoggedIn,
  adminController.handleReviewManage
);
router.delete(
  "/admin/reviews/:reviewId",
  adminController.checkLoggedIn,
  adminController.handleDeleteReview
);

// Posts
router.get(
  "/admin/posts",
  adminController.checkLoggedIn,
  adminController.handlePostManage
);
router.get(
  "/admin/posts/create",
  adminController.checkLoggedIn,
  adminController.getCreatePost
);
router.post(
  "/admin/posts",
  adminController.checkLoggedIn,
  upload.single("image"),
  adminController.handleStorePost
);
router.delete(
  "/admin/posts/:postId",
  adminController.checkLoggedIn,
  adminController.handleDeletePost
);

router.get(
  "/admin/posts/:postId",
  adminController.checkLoggedIn,
  adminController.getEditPost
);

router.patch(
  "/admin/posts/:postId",
  adminController.checkLoggedIn,
  upload.single("image"),
  adminController.handleUpdatePost
);


// Invoice
router.get(
  "/admin/orders/:orderId/invoice",
  adminController.checkLoggedIn,
  adminController.printInvoice
);

// Banners
router.get(
  "/admin/banners",
  adminController.checkLoggedIn,
  adminController.handleBannerManage
);

router.get(
  "/admin/banners/:bannerId",
  adminController.checkLoggedIn,
  adminController.getEditBanner
);

router.post(
  "/admin/banners",
  adminController.checkLoggedIn,
  upload.single("image"),
  adminController.handleCreateBanner
);

router.put(
  "/admin/banners/:bannerId",
  adminController.checkLoggedIn,
  upload.single("image"),
  adminController.handleUpdateBanner
);

router.delete(
  "/admin/banners/:bannerId",
  adminController.checkLoggedIn,
  adminController.handleDeleteBanner
);


export default router;
