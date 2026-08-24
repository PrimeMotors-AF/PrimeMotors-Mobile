"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateFavoriteMessageController = exports.deleteFavoriteController = exports.createFavoriteController = exports.toggleFavoriteController = exports.listFavoritesController = void 0;
const library_1 = require("@prisma/client/runtime/library");
const favoriteService_1 = require("../services/favoriteService");
const parsePaginationParam = (value, fallback) => {
    const pageString = Array.isArray(value) ? value[0] : value;
    const parsed = typeof pageString === "string" ? Number(pageString) : NaN;
    return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
};
const getUserIdFromRequest = (req) => req.user?.id;
const listFavoritesController = async (req, res) => {
    const authenticatedUserId = getUserIdFromRequest(req);
    const requestedUserId = String(req.params.id || "");
    if (!authenticatedUserId)
        return res.status(401).json({ error: "Não autenticado." });
    if (authenticatedUserId !== requestedUserId)
        return res.status(403).json({ error: "Acesso negado." });
    try {
        const page = parsePaginationParam(req.query.page, 1);
        const limit = parsePaginationParam(req.query.limit, 10);
        return res
            .status(200)
            .json(await (0, favoriteService_1.getFavoritesByUser)(requestedUserId, page, limit));
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao buscar lista de desejos." });
    }
};
exports.listFavoritesController = listFavoritesController;
const toggleFavoriteController = async (req, res) => {
    const authenticatedUserId = getUserIdFromRequest(req);
    if (!authenticatedUserId)
        return res.status(401).json({ error: "Não autenticado." });
    const { userId, carId, message } = req.body;
    if (!carId)
        return res.status(400).json({ error: "carId é obrigatório." });
    if (userId && userId !== authenticatedUserId)
        return res.status(403).json({ error: "O usuário não confere." });
    try {
        const existingFavorite = await (0, favoriteService_1.findFavorite)(authenticatedUserId, carId);
        if (existingFavorite) {
            await (0, favoriteService_1.deleteFavorite)(authenticatedUserId, carId);
            return res.status(200).json({ message: "Favorito removido." });
        }
        const favorite = await (0, favoriteService_1.createFavorite)(authenticatedUserId, carId, message);
        return res.status(201).json({ message: "Favorito adicionado.", favorite });
    }
    catch (error) {
        console.error(error);
        if (error instanceof library_1.PrismaClientKnownRequestError &&
            error.code === "P2002")
            return res.status(409).json({ error: "Favorito já existe." });
        return res
            .status(500)
            .json({ error: "Erro ao atualizar lista de desejos." });
    }
};
exports.toggleFavoriteController = toggleFavoriteController;
const createFavoriteController = async (req, res) => {
    const authenticatedUserId = getUserIdFromRequest(req);
    if (!authenticatedUserId)
        return res.status(401).json({ error: "Não autenticado." });
    const { carId, message } = req.body;
    if (!carId)
        return res.status(400).json({ error: "carId é obrigatório." });
    try {
        const favorite = await (0, favoriteService_1.createFavorite)(authenticatedUserId, carId, message);
        return res.status(201).json(favorite);
    }
    catch (error) {
        console.error(error);
        if (error instanceof library_1.PrismaClientKnownRequestError &&
            error.code === "P2002")
            return res.status(409).json({ error: "Favorito já existe." });
        return res.status(500).json({ error: "Erro ao criar favorito." });
    }
};
exports.createFavoriteController = createFavoriteController;
const deleteFavoriteController = async (req, res) => {
    const authenticatedUserId = getUserIdFromRequest(req);
    if (!authenticatedUserId)
        return res.status(401).json({ error: "Não autenticado." });
    const carId = String(req.params.carId || "");
    if (!carId)
        return res.status(400).json({ error: "carId é obrigatório." });
    try {
        const deleted = await (0, favoriteService_1.deleteFavorite)(authenticatedUserId, carId);
        if (!deleted)
            return res.status(404).json({ error: "Favorito não encontrado." });
        return res.status(200).json({ message: "Favorito removido." });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao remover favorito." });
    }
};
exports.deleteFavoriteController = deleteFavoriteController;
const updateFavoriteMessageController = async (req, res) => {
    const authenticatedUserId = getUserIdFromRequest(req);
    if (!authenticatedUserId)
        return res.status(401).json({ error: "Não autenticado." });
    const favoriteId = String(req.params.id || "");
    if (!favoriteId)
        return res.status(400).json({ error: "favoriteId é obrigatório." });
    const { message } = req.body;
    try {
        const updated = await (0, favoriteService_1.updateFavoriteMessage)(favoriteId, authenticatedUserId, message);
        if (!updated)
            return res.status(404).json({ error: "Favorito não encontrado." });
        return res.status(200).json(updated);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Erro ao atualizar anotação." });
    }
};
exports.updateFavoriteMessageController = updateFavoriteMessageController;
//# sourceMappingURL=favoriteController.js.map