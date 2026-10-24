"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminMiddleware = void 0;
const database_1 = __importDefault(require("../config/database"));
const adminMiddleware = async (req, res, next) => {
    if (!req.user?.id) {
        return res.status(401).json({ error: "Não autenticado." });
    }
    const user = await database_1.default.user.findUnique({
        where: { id: req.user.id },
        select: { role: true, active: true },
    });
    if (!user?.active || user.role !== "admin") {
        return res.status(403).json({ error: "Acesso restrito a administradores." });
    }
    return next();
};
exports.adminMiddleware = adminMiddleware;
//# sourceMappingURL=adminMiddleware.js.map