import express from "express";

import homeController from "../controllers/homeController";
import authController from "../controllers/authController";
import cartController from "../controllers/cartController";
import orderController from "../controllers/orderController";

const router = express.Router();

/**
 * ============== PUBLIC (SHOP) ==============
 */

// Health
router.get("/health", (req, res) => res.json({ ok: true }));

// Products
router.get("/products", homeController.getHomePage);

// slug route phải đặt trước /products/:id
router.get("/products/slug/:slug", homeController.getDetailProductBySlug);

// Categories
router.get("/categories", homeController.getCategories);


// optional debug
router.get("/products/:id", homeController.getDetailProductById);

// Auth (User)
router.post("/auth/register", authController.handleRegister);
router.post("/auth/login", authController.handleLogin);
router.post("/auth/logout", authController.handleLogout);
router.get("/auth/me", authController.getMe);

// Cart
router.get("/cart", cartController.getCartPage);
router.post("/cart/items", cartController.addToCart);
router.delete("/cart/items/:variantId", cartController.deleteItemCart);

// Orders / Checkout
router.post("/orders", orderController.handleCheckout);
router.get("/checkout", orderController.getCheckoutPage);

export default router;
