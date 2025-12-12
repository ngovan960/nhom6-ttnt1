import express from "express";
import { toggleWishlist, getWishlistByUser } from "../controllers/WishlistController.js";

const router = express.Router();

router.post("/wishlist/toggle", toggleWishlist);
router.get("/wishlist/:userId", getWishlistByUser);

export default router;
