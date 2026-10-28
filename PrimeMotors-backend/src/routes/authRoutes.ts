import { Router } from "express";
import { register, login } from "../controllers/authControllers";
import { authMiddleware } from "../middlewares/authMiddleware";
import { authRateLimit } from "../middlewares/rateLimit";

const router = Router();

router.post("/users", authRateLimit, register);
router.post("/login", authRateLimit, login);


export default router;
