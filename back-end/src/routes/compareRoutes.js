import express from "express";
import {
  addToCompare,
  removeFromCompare,
  getCompareList,
  clearCompare,
} from "../controllers/CompareController.js";

const router = express.Router();

router.get("/compare/:userId", getCompareList);
router.post("/compare/add", addToCompare);
router.post("/compare/remove", removeFromCompare);
router.delete("/compare/clear/:userId", clearCompare);

export default router;
