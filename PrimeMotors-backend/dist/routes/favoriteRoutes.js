"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const favoriteController_1 = require("../controllers/favoriteController");
const router = (0, express_1.Router)();
router.get("/:id", authMiddleware_1.authMiddleware, favoriteController_1.listFavoritesController);
router.post("/toggle", authMiddleware_1.authMiddleware, favoriteController_1.toggleFavoriteController);
router.post("/", authMiddleware_1.authMiddleware, favoriteController_1.createFavoriteController);
router.delete("/:carId", authMiddleware_1.authMiddleware, favoriteController_1.deleteFavoriteController);
router.patch("/:id/message", authMiddleware_1.authMiddleware, favoriteController_1.updateFavoriteMessageController);
exports.default = router;
//# sourceMappingURL=favoriteRoutes.js.map