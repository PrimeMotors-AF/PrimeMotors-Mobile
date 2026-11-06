"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const crypto_1 = require("crypto");
const internalEmailController_1 = require("../controllers/internalEmailController");
const router = (0, express_1.Router)();
router.get("/proposals/:proposalId/email-event", (req, res, next) => {
    const expectedToken = process.env.SERVICE_TOKEN;
    const providedToken = req.header("X-Service-Token");
    if (!expectedToken || !providedToken) {
        return res.status(401).json({ error: "Token de serviço inválido." });
    }
    const expectedBuffer = Buffer.from(expectedToken, "utf8");
    const providedBuffer = Buffer.from(providedToken, "utf8");
    if (expectedBuffer.length !== providedBuffer.length ||
        !(0, crypto_1.timingSafeEqual)(expectedBuffer, providedBuffer)) {
        return res.status(401).json({ error: "Token de serviço inválido." });
    }
    void (0, internalEmailController_1.getProposalEmailEvent)(req, res).catch(next);
});
exports.default = router;
//# sourceMappingURL=internalRoutes.js.map