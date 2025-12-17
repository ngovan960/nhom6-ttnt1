import express from "express";
import { checkout } from "../controllers/checkout.controller.js";
import { authMiddleware } from "../middlewares/authMid.js";

const router = express.Router();

router.post("/", authMiddleware, checkout);

export default router;
