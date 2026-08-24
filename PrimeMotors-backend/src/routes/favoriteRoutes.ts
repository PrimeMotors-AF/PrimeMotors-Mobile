import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import {
  createFavoriteController,
  deleteFavoriteController,
  listFavoritesController,
  toggleFavoriteController,
  updateFavoriteMessageController,
} from "../controllers/favoriteController";

const router = Router();

router.get("/:id", authMiddleware, listFavoritesController);
router.post("/toggle", authMiddleware, toggleFavoriteController);
router.post("/", authMiddleware, createFavoriteController);
router.delete("/:carId", authMiddleware, deleteFavoriteController);
router.patch("/:id/message", authMiddleware, updateFavoriteMessageController);

export default router;
