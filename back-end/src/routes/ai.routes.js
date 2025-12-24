import express from "express";
import { suggestProducts } from "../controllers/AIController.js";
import { authMiddleware } from "../middlewares/authMid.js";

const router = express.Router();

// Route tư vấn AI (yêu cầu login để lưu lịch sử, hoặc có thể public nếu muốn)
router.post("/suggest", authMiddleware, suggestProducts);

export default router;
