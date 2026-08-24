"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteUserController = exports.updateUserController = exports.getUserController = void 0;
const userService_1 = require("../services/userService");
const getUserController = async (req, res) => {
    const { id } = req.params;
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    if (!id || typeof id !== "string" || !uuidRegex.test(id)) {
        return res.status(400).json({ error: "ID de usuário inválido" });
    }
    try {
        const user = await (0, userService_1.getUserByIdService)(id);
        if (!user) {
            return res
                .status(404)
                .json({ message: "Usuário não encontrado no banco" });
        }
        return res.json(user);
    }
    catch (error) {
        return res.status(500).json({ error: "Erro interno no servidor" });
    }
};
exports.getUserController = getUserController;
const updateUserController = async (req, res) => {
    try {
        const tokenUserId = req.user?.id;
        const id = req.params.id;
        if (!tokenUserId || tokenUserId !== id) {
            return res.status(403).json({ error: "Acesso negado." });
        }
        const updatedUser = await (0, userService_1.updateUserService)(id, req.body);
        return res.status(200).json(updatedUser);
    }
    catch (error) {
        if (error instanceof Error && error.message === "Usuário não encontrado.") {
            return res.status(404).json({ message: error.message });
        }
        if (error instanceof Error &&
            error.message.includes("Não é permitido alterar o email")) {
            return res.status(400).json({ message: error.message });
        }
        if (error instanceof Error &&
            (error.message.includes("obrigatórios") ||
                error.message.includes("inválido"))) {
            return res.status(400).json({ message: error.message });
        }
        return res.status(500).json({ message: "Erro ao atualizar" });
    }
};
exports.updateUserController = updateUserController;
const deleteUserController = async (req, res) => {
    try {
        const tokenUserId = req.user?.id;
        const id = req.params.id;
        if (!tokenUserId || tokenUserId !== id) {
            return res.status(403).json({ message: "Acesso negado." });
        }
        await (0, userService_1.deactivateUserService)(id);
        return res.status(200).json({ message: "Usuário desativado" });
    }
    catch (error) {
        if (error instanceof Error && error.message === "Usuário não encontrado.") {
            return res.status(404).json({ message: error.message });
        }
        return res.status(500).json({ message: "Erro ao deletar" });
    }
};
exports.deleteUserController = deleteUserController;
//# sourceMappingURL=userController.js.map