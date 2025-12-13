import express from "express";
import { getReviewsByProduct, createReview } from "../controllers/ReviewController.js";

const router = express.Router();

router.get("/products/:productId/reviews", getReviewsByProduct);
router.post("/products/:productId/reviews", createReview);

export default router;
