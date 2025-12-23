import express from "express";
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getRelatedProducts,
  getProductsByCategoryId,
} from "../controllers/ProductController.js";
import { authMiddleware } from "../middlewares/authMid.js";

const router = express.Router();

// CRUD
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", authMiddleware, createProduct);
router.put("/:id", authMiddleware, updateProduct);
router.delete("/:id", authMiddleware, deleteProduct);
router.get("/category/:categoryId", getProductsByCategoryId);

// Related
router.get("/products/:id/related", getRelatedProducts);

export default router;
