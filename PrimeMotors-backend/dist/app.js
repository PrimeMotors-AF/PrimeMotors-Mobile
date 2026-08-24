"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const carRoutes_1 = __importDefault(require("./routes/carRoutes"));
const favoriteRoutes_1 = __importDefault(require("./routes/favoriteRoutes"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const userGarageRoutes_1 = __importDefault(require("./routes/userGarageRoutes"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: ["http://localhost:5173", "http://localhost", "https://localhost"],
    credentials: true,
}));
app.get("/", (req, res) => {
    res.json({ message: "Backend rodando com sucesso!" });
});
app.use("/auth", authRoutes_1.default);
app.use("/users", authMiddleware_1.authMiddleware, userRoutes_1.default);
app.use("/garage", userGarageRoutes_1.default);
app.use("/favorites", favoriteRoutes_1.default);
app.use("/cars", carRoutes_1.default);
exports.default = app;
//# sourceMappingURL=app.js.map