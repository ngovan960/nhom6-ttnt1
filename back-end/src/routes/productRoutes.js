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

const router = express.Router();

// CRUD
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.post("/", createProduct);
router.put("/:id", updateProduct);
router.delete("/:id", deleteProduct);
router.get("/category/:categoryId", getProductsByCategoryId);

// Related
router.get("/products/:id/related", getRelatedProducts);

export default router;
