import express from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from "../controllers/CartController.js";

const router = express.Router();

router.get("/cart", getCart);
router.post("/cart/items", addToCart);
router.put("/cart/items/:id", updateCartItem);
router.delete("/cart/items/:id", removeCartItem);

export default router;
