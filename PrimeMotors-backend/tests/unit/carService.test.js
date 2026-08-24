"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_1 = __importDefault(require("../../src/config/database"));
const favoriteService_1 = require("../../src/services/favoriteService");
jest.mock('../../src/config/database', () => ({
    favorite: { findMany: jest.fn(), create: jest.fn(), findFirst: jest.fn(), delete: jest.fn() }
}));
describe('FavoriteService', () => {
    it('getFavoritesByUser deve retornar lista de favoritos formatados', async () => {
        const mockFavorites = [{ id: 'fav1', carId: 'car1', message: 'Gostei Desse!', createAt: new Date(), car: { id: 'car1', name: 'Carro1', brand: { name: 'Brand1' }, images: [{ url: 'img1.jpg' }], value: 10000 } }];
        database_1.default.favorite.findMany.mockResolvedValue(mockFavorites);
        const result = await (0, favoriteService_1.getFavoritesByUser)('user1');
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('name', 'Carro1');
    });
    it('createFavorite deve criar favorito', async () => {
        const mockFavorite = { id: 'fav1', userId: 'user1', carId: 'car1', message: 'Teste' };
        database_1.default.favorite.create.mockResolvedValue(mockFavorite);
        const result = await (0, favoriteService_1.createFavorite)('user1', 'car1', 'Teste');
        expect(result).toEqual(mockFavorite);
    });
    it('deleteFavorite deve deletar se favorito existir', async () => {
        const mockFavorite = { id: 'fav1' };
        database_1.default.favorite.findFirst.mockResolvedValue(mockFavorite);
        database_1.default.favorite.delete.mockResolvedValue(mockFavorite);
        const result = await (0, favoriteService_1.deleteFavorite)('user1', 'car1');
        expect(result).toEqual(mockFavorite);
    });
    it('deleteFavorite deve retornar null se não existir', async () => {
        database_1.default.favorite.findFirst.mockResolvedValue(null);
        const result = await (0, favoriteService_1.deleteFavorite)('user1', 'car1');
        expect(result).toBeNull();
    });
});
//# sourceMappingURL=carService.test.js.map