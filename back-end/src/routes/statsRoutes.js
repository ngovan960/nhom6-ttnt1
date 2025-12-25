import express from "express";
import { getRevenueStats, getBestSellingProducts } from "../controllers/AdminStatsController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMid.js";

const router = express.Router();

router.get("/revenue", authMiddleware, isAdmin, getRevenueStats);
router.get("/best-sellers", authMiddleware, isAdmin, getBestSellingProducts);

export default router;
