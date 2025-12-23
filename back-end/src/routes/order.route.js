import express from "express";
import {
  getMyOrders,
  getOrderDetail,
  cancelOrder,
} from "../controllers/orders.controller.js";
import { authMiddleware } from "../middlewares/authMid.js";

const router = express.Router();

// Lấy danh sách đơn hàng của user
router.get("/orders", authMiddleware, getMyOrders);

// Lấy chi tiết 1 đơn hàng
router.get("/orders/:id", authMiddleware, getOrderDetail);

// Hủy đơn hàng
router.put("/orders/:id/cancel", authMiddleware, cancelOrder);

export default router;
