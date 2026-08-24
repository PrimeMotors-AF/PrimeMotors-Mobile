"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controllers/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.get('/:id', userController_1.getUserController);
router.patch('/:id', authMiddleware_1.authMiddleware, userController_1.updateUserController);
router.delete("/:id", authMiddleware_1.authMiddleware, userController_1.deleteUserController);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map