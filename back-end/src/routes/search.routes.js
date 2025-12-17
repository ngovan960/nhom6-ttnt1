import express from "express";
import {
  searchProducts,
  suggestKeywords,
} from "../controllers/search.controller.js";

const router = express.Router();

// 🔍 search sản phẩm
router.get("/", searchProducts);

// 💡 gợi ý realtime khi gõ
router.get("/suggest", suggestKeywords);

export default router;
