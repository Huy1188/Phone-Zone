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




router.get("/health", (req, res) => res.json({ ok: true }));


router.get("/products", homeController.getHomePage);


router.get("/products/slug/:slug", homeController.getDetailProductBySlug);

router.get("/products/related", homeController.getRelatedProducts);


router.get("/products/:productId/reviews/can-review", reviewController.canReview);
router.get("/products/:productId/reviews", reviewController.listProductReviews);
router.get("/products/:productId/reviews/summary", reviewController.getReviewSummary);
router.post(
  "/products/:productId/reviews",
  reviewController.requireUser,
  reviewController.upsertMyReview
);


router.get("/categories", homeController.getCategories);
router.get("/brands", homeController.getBrands);



router.get("/products/:id", homeController.getDetailProductById);


router.post("/auth/register", authController.handleRegister);
router.post("/auth/login", authController.handleLogin);
router.post("/auth/logout", authController.handleLogout);
router.get("/auth/me", authController.getMe);


router.put("/users/me", updateMe);
router.patch("/users/me/password", changeMyPassword);



router.get("/cart", cartController.getCart);
router.post("/cart/items", cartController.addItem);
router.patch("/cart/items/:variantId", cartController.updateQuantity);
router.delete("/cart/items/:variantId", cartController.deleteItem);


router.post("/orders", orderController.handleCheckout);
router.get("/checkout", orderController.getCheckoutPage);
router.get("/orders/me", orderController.getMyOrders);


router.get("/users/me/addresses", addressController.listMyAddresses);
router.post("/users/me/addresses", addressController.createMyAddress);
router.put("/users/me/addresses/:id", addressController.updateMyAddress);
router.delete("/users/me/addresses/:id", addressController.deleteMyAddress);
router.patch("/users/me/addresses/:id/default", addressController.setDefaultMyAddress);


router.get("/users/me/addresses/default", addressController.getMyDefaultAddress);


router.get("/news", getNewsList);
router.get("/news/:slug", getNewsDetailBySlug);


export default router;
