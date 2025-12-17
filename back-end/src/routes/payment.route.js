import express from "express";
import {
  createPayment,
  paymentCallback,
} from "../controllers/payments.controller.js";
import { authMiddleware } from "../middlewares/authMid.js";

const router = express.Router();

router.post("/payments/create", authMiddleware, createPayment);
router.post("/payments/callback", paymentCallback);

export default router;
