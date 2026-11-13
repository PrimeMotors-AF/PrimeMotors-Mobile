"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const adminMiddleware_1 = require("../middlewares/adminMiddleware");
const garageController_1 = require("../controllers/garageController");
const router = (0, express_1.Router)();
router.post("/proposals", authMiddleware_1.authMiddleware, garageController_1.createProposal);
router.get("/admin/proposals", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, garageController_1.getAllProposals);
router.patch("/admin/proposals/:proposalId/status", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, garageController_1.updateProposalStatus);
router.delete("/admin/proposals/:proposalId", authMiddleware_1.authMiddleware, adminMiddleware_1.adminMiddleware, garageController_1.deleteAdminProposal);
router.get("/:id", authMiddleware_1.authMiddleware, garageController_1.getUserProposals);
router.put("/:proposalId", authMiddleware_1.authMiddleware, garageController_1.updateProposal);
router.delete("/:proposalId", authMiddleware_1.authMiddleware, garageController_1.deleteProposal);
exports.default = router;
//# sourceMappingURL=userGarageRoutes.js.map