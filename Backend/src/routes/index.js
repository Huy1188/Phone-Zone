import express from "express";
import publicRoutes from "./public.routes";
import adminRoutes from "./admin.routes";

const router = express.Router();

// Giữ nguyên URL như cũ (public + /admin/*)
router.use(publicRoutes);
router.use(adminRoutes);

export default router;
