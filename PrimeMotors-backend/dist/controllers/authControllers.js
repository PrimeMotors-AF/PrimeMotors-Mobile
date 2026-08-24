"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.register = void 0;
const userService_1 = require("../services/userService");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const register = async (req, res) => {
    try {
        const data = req.body;
        const newUser = await (0, userService_1.createUserService)(data);
        return res.status(201).json(newUser);
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Erro desconhecido";
        return res.status(400).json({ message });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res
                .status(400)
                .json({ message: "Email e senha são obrigatórios." });
        }
        const user = await (0, userService_1.loginService)(email);
        if (!user || !(await bcrypt_1.default.compare(password, user.password))) {
            return res.status(401).json({ message: "E-mail ou senha incorretos" });
        }
        if (!user.active) {
            return res
                .status(401)
                .json({ message: "Usuário inexistente ou desativado." });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN });
        const { password: _, ...userWithoutPassword } = user;
        return res
            .status(200)
            .json({ message: "Login realizado!", token, user: userWithoutPassword });
    }
    catch (error) {
        const message = error instanceof Error ? error.message : "Erro interno no servidor";
        return res.status(500).json({ message });
    }
};
exports.login = login;
//# sourceMappingURL=authControllers.js.map