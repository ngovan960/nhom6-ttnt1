import { Router } from "express";
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from "../controllers/cart.controller.js";
import { authMiddleware } from "../middlewares/authMid.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getCart);
router.post("/items", addToCart);
router.put("/items/:id", updateCartItem);
router.delete("/items/:id", removeCartItem);
router.delete("/clear", clearCart);

export default router;
