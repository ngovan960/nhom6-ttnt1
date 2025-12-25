import express from "express";
import { suggestProducts, compareProducts } from "../controllers/AIController.js";
import { authMiddleware } from "../middlewares/authMid.js";

const router = express.Router();

// Route tư vấn AI (yêu cầu login để lưu lịch sử, hoặc có thể public nếu muốn)
router.post("/suggest", authMiddleware, suggestProducts);

// Route so sánh sản phẩm dùng Gemini
router.post("/compare", compareProducts);

export default router;
