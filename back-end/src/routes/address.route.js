import { Router } from "express";
import {
  createAddress,
  deleteAddress,
  getAddress,
  updateAddress,
} from "../controllers/address.controller.js";
import { authMiddleware } from "../middlewares/authMid.js";

const router = Router();

router.use(authMiddleware);

router.get("/", getAddress);
router.post("/", createAddress);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

export default router;
