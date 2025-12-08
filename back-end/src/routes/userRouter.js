import { Router } from "express";
import {
  userLogin,
  userRegister,
  forgotPassword,
  verifyResetToken,
  resetPassword,
} from "../controllers/userauth.js";

const router = Router();

router.post("/login", userLogin);
router.post("/register", userRegister);

router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", verifyResetToken);
router.post("/reset-password", resetPassword);

export default router;
