"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFavoritesByUser = getFavoritesByUser;
exports.createFavorite = createFavorite;
exports.deleteFavorite = deleteFavorite;
exports.findFavorite = findFavorite;
exports.updateFavoriteMessage = updateFavoriteMessage;
const database_1 = __importDefault(require("../config/database"));
async function getFavoritesByUser(userId, page = 1, limit = 10) {
    const validPage = Number.isInteger(page) && page > 0 ? page : 1;
    const validLimit = Number.isInteger(limit) && limit > 0 ? limit : 10;
    const favorites = await database_1.default.favorite.findMany({
        where: { userId },
        include: {
            car: {
                include: {
                    brand: true,
                    images: true,
                },
            },
        },
        orderBy: { createdAt: "desc" },
        skip: (validPage - 1) * validLimit,
        take: validLimit,
    });
    return favorites.map((favorite) => ({
        id: favorite.car.id,
        favoriteId: favorite.id,
        carId: favorite.carId,
        name: favorite.car.name,
        brand: favorite.car.brand.name,
        imgUrl: favorite.car.images[0]?.url || "/placeholder-car.png",
        offeredValue: Number(favorite.car.value),
        message: favorite.message,
        createdAt: favorite.createdAt,
    }));
}
async function createFavorite(userId, carId, message) {
    return database_1.default.favorite.create({
        data: {
            user: {
                connect: { id: userId },
            },
            car: {
                connect: { id: carId },
            },
            message,
        },
    });
}
async function deleteFavorite(userId, carId) {
    const favorite = await database_1.default.favorite.findFirst({
        where: { userId, carId },
    });
    if (!favorite)
        return null;
    return database_1.default.favorite.delete({ where: { id: favorite.id } });
}
async function findFavorite(userId, carId) {
    return database_1.default.favorite.findFirst({ where: { userId, carId } });
}
async function updateFavoriteMessage(favoriteId, userId, message) {
    const favorite = await database_1.default.favorite.findFirst({
        where: { id: favoriteId, userId },
    });
    if (!favorite)
        return null;
    return database_1.default.favorite.update({
        where: { id: favoriteId },
        data: { message },
    });
}
//# sourceMappingURL=favoriteService.js.map