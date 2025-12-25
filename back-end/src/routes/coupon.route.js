import express from "express";
import { 
  applyCoupon,
  getAllCoupons, 
  createCoupon, 
  updateCoupon, 
  deleteCoupon
} from "../controllers/CouponController.js";
import { authMiddleware, isAdmin } from "../middlewares/authMid.js";

const router = express.Router();

// Public route
router.post("/apply", applyCoupon);

// Admin routes
router.use(authMiddleware, isAdmin);
router.get("/", getAllCoupons);
router.post("/", createCoupon);
router.put("/:id", updateCoupon);
router.delete("/:id", deleteCoupon);

export default router;
