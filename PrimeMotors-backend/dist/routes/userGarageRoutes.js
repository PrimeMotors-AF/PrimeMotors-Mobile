"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const garageController_1 = require("../controllers/garageController");
const router = (0, express_1.Router)();
router.post("/proposals", authMiddleware_1.authMiddleware, garageController_1.createProposal);
router.get("/:id", authMiddleware_1.authMiddleware, garageController_1.getUserProposals);
router.put("/:proposalId", authMiddleware_1.authMiddleware, garageController_1.updateProposal);
router.delete("/:proposalId", authMiddleware_1.authMiddleware, garageController_1.deleteProposal);
exports.default = router;
//# sourceMappingURL=userGarageRoutes.js.map