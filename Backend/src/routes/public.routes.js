import express from "express";

import homeController from "../controllers/homeController";
import authController from "../controllers/authController";
import cartController from "../controllers/cartController";
import orderController from "../controllers/orderController";
import { updateMe, changeMyPassword } from "../controllers/userController";
import * as addressController from "../controllers/addressController";
import * as reviewController from "../controllers/reviewController";
import {getNewsList, getNewsDetailBySlug} from "../controllers/newsController"



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
// Related products
router.get("/products/related", homeController.getRelatedProducts);

// Reviews
router.get("/products/:productId/reviews/can-review", reviewController.canReview);
router.get("/products/:productId/reviews", reviewController.listProductReviews);
router.get("/products/:productId/reviews/summary", reviewController.getReviewSummary);
router.post(
  "/products/:productId/reviews",
  reviewController.requireUser,
  reviewController.upsertMyReview
);

// Categories
router.get("/categories", homeController.getCategories);
router.get("/brands", homeController.getBrands);


// optional debug
router.get("/products/:id", homeController.getDetailProductById);

// Auth (User)
router.post("/auth/register", authController.handleRegister);
router.post("/auth/login", authController.handleLogin);
router.post("/auth/logout", authController.handleLogout);
router.get("/auth/me", authController.getMe);

// Profile
router.put("/users/me", updateMe);
router.patch("/users/me/password", changeMyPassword);


// Cart (level 2: guest=session, user=db)
router.get("/cart", cartController.getCart);
router.post("/cart/items", cartController.addItem);
router.patch("/cart/items/:variantId", cartController.updateQuantity);
router.delete("/cart/items/:variantId", cartController.deleteItem);

// Orders / Checkout
router.post("/orders", orderController.handleCheckout);
router.get("/checkout", orderController.getCheckoutPage);
router.get("/orders/me", orderController.getMyOrders);

// Address (User)
router.get("/users/me/addresses", addressController.listMyAddresses);
router.post("/users/me/addresses", addressController.createMyAddress);
router.put("/users/me/addresses/:id", addressController.updateMyAddress);
router.delete("/users/me/addresses/:id", addressController.deleteMyAddress);
router.patch("/users/me/addresses/:id/default", addressController.setDefaultMyAddress);

// Default address for checkout autofill
router.get("/users/me/addresses/default", addressController.getMyDefaultAddress);

// News
router.get("/news", getNewsList);
router.get("/news/:slug", getNewsDetailBySlug);


export default router;
