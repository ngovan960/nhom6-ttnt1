import { Router } from "express";
import { authMiddleware, isAdmin } from "../middlewares/authMid.js";
import {
  getAllUsers,
  getUserDetail,
  updateUser,
  deleteUser,
} from "../controllers/AdminUserController.js";
import {
  getAllOrders,
  updateOrderStatus,
  deleteOrder,
} from "../controllers/AdminOrderController.js";
import { getOrderDetail } from "../controllers/orders.controller.js"; // Reuse existing detail controller or create specific one if needed. Admin might need more info.

const router = Router();

// Middleware for all admin routes
router.use(authMiddleware, isAdmin);

// User Management
router.get("/users", getAllUsers);
router.get("/users/:id", getUserDetail);
router.put("/users/:id", updateUser); // Role, status updates
router.delete("/users/:id", deleteUser);

// Order Management
router.get("/orders", getAllOrders);
router.get("/orders/:id", getOrderDetail); // Using existing getOrderDetail for now, assuming it returns enough info.
router.put("/orders/:id/status", updateOrderStatus);
router.delete("/orders/:id", deleteOrder);

export default router;
