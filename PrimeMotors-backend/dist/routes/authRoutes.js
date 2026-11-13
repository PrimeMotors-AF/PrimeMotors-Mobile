"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authControllers_1 = require("../controllers/authControllers");
const rateLimit_1 = require("../middlewares/rateLimit");
const router = (0, express_1.Router)();
router.post("/users", rateLimit_1.authRateLimit, authControllers_1.register);
router.post("/login", rateLimit_1.authRateLimit, authControllers_1.login);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map