import { Router } from "express";
import { userLogin, userRegister } from "../controllers/userauth.js";

const router = Router();

router.post("/login", userLogin);
router.post("/register", userRegister);

export default router;
