import { Router } from "express";
import {
  userLogin,
  userRegister,
  forgotPassword,
  verifyResetToken,
  resetPassword,
  updateProfile,
} from "../controllers/userauth.js";
import { authMiddleware } from "../middlewares/authMid.js";

const router = Router();

router.post("/login", userLogin);
router.post("/register", userRegister);

router.post("/forgot-password", forgotPassword);
router.get("/reset-password/:token", verifyResetToken);
router.post("/reset-password", resetPassword);

router.put("/update-profile", authMiddleware, updateProfile);

export default router;
