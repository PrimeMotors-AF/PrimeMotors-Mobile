import { loginService } from '../../src/services/userService';
import prisma from '../../src/config/database';
import { createFavorite, deleteFavorite, getFavoritesByUser } from '../../src/services/favoriteService';

jest.mock('../../src/config/database', () => ({
    favorite: { findMany: jest.fn(), create: jest.fn(), findFirst: jest.fn(), delete: jest.fn() }
}))

describe('FavoriteService', () => {
    it('getFavoritesByUser deve retornar lista de favoritos formatados', async () => {
        const mockFavorites = [{ id: 'fav1', carId: 'car1', message: 'Gostei Desse!', createAt: new Date(), car: { id: 'car1', name: 'Carro1', brand: { name: 'Brand1' }, images: [{ url: 'img1.jpg' }], value: 10000 } }];
        (prisma.favorite.findMany as jest.Mock).mockResolvedValue(mockFavorites);

        const result = await getFavoritesByUser('user1');
        expect(result).toHaveLength(1);
        expect(result[0]).toHaveProperty('name', 'Carro1');
    });


    it('createFavorite deve criar favorito', async () => {
        const mockFavorite = { id: 'fav1', userId: 'user1', carId: 'car1', message: 'Teste' };
        (prisma.favorite.create as jest.Mock).mockResolvedValue(mockFavorite);

        const result = await createFavorite('user1', 'car1', 'Teste');
        expect(result).toEqual(mockFavorite);
    });

    it('deleteFavorite deve deletar se favorito existir', async () => {
        const mockFavorite = { id: 'fav1' };
        (prisma.favorite.findFirst as jest.Mock).mockResolvedValue(mockFavorite);
        (prisma.favorite.delete as jest.Mock).mockResolvedValue(mockFavorite);

        const result = await deleteFavorite('user1', 'car1');
        expect(result).toEqual(mockFavorite);
    });

    it('deleteFavorite deve retornar null se não existir', async () => {
        (prisma.favorite.findFirst as jest.Mock).mockResolvedValue(null);

        const result = await deleteFavorite('user1', 'car1');
        expect(result).toBeNull();
    });
})











