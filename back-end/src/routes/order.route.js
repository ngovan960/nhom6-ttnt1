import express from "express";
import {
  getMyOrders,
  getOrderDetail,
} from "../controllers/orders.controller.js";
import { authMiddleware } from "../middlewares/authMid.js";

const router = express.Router();

// Lấy danh sách đơn hàng của user
router.get("/orders", authMiddleware, getMyOrders);

// Lấy chi tiết 1 đơn hàng
router.get("/orders/:id", authMiddleware, getOrderDetail);

export default router;
