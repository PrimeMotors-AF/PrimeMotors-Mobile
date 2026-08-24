"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const authMiddleware = (req, res, next) => {
    const [scheme, token] = req.headers.authorization?.split(" ") || [];
    if (!token || !/^Bearer$/i.test(scheme)) {
        return res
            .status(401)
            .json({ message: "Token Não Fornecido ou Malformatado" });
    }
    try {
        const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
        req.user = payload;
        return next();
    }
    catch {
        return res.status(401).json({ message: "Token Inválido ou Expirado!" });
    }
};
exports.authMiddleware = authMiddleware;
//# sourceMappingURL=authMiddleware.js.map