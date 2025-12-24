import express from "express";
import {
    getAllCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/CategoryController.js";
import { authMiddleware } from "../middlewares/authMid.js";

const router = express.Router();

router.get("/", getAllCategories);
router.post("/", authMiddleware, createCategory);
router.put("/:id", authMiddleware, updateCategory);
router.delete("/:id", authMiddleware, deleteCategory);

export default router;
