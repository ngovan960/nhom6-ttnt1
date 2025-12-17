import express from "express";
import { applyCoupon } from "../controllers/CouponController.js";

const router = express.Router();
router.post("/coupons/apply", applyCoupon);
export default router;
