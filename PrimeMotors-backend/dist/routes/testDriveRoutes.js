"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const testDriveController_1 = require("../controllers/testDriveController");
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.authMiddleware, testDriveController_1.createTestDriveController);
router.get("/user/:id", authMiddleware_1.authMiddleware, testDriveController_1.listTestDrivesController);
router.put("/:id", authMiddleware_1.authMiddleware, testDriveController_1.updateTestDriveController);
router.delete("/:id", authMiddleware_1.authMiddleware, testDriveController_1.deleteTestDriveController);
exports.default = router;
//# sourceMappingURL=testDriveRoutes.js.map