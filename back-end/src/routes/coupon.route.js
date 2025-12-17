import express from "express";
import {
  validateCoupon,
  createCoupon,
} from "../controllers/coupon.controller.js";

const router = express.Router();

router.post("/", createCoupon);
router.post("/validate", validateCoupon);

export default router;
