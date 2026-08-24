import {
  getFavoritesByUser,
  createFavorite,
  deleteFavorite,
  findFavorite,
  updateFavoriteMessage,
} from "../../src/services/favoriteService";
import prisma from "../../src/config/database";

jest.mock("../../src/config/database", () => ({
  favorite: {
    findMany: jest.fn(),
    create: jest.fn(),
    findFirst: jest.fn(),
    delete: jest.fn(),
    update: jest.fn(),
  },
}));

describe("FavoriteService", () => {
  it("getFavoritesByUser deve retornar lista formatada", async () => {
    const mockFavorites = [
      {
        id: "fav1",
        carId: "car1",
        message: "Gostei",
        createdAt: new Date(),
        car: {
          id: "car1",
          name: "Carro1",
          brand: { name: "Brand1" },
          images: [{ url: "img1.jpg" }],
          value: 10000,
        },
      },
    ];
    (prisma.favorite.findMany as jest.Mock).mockResolvedValue(mockFavorites);

    const result = await getFavoritesByUser("user1", 1, 5);
    expect(prisma.favorite.findMany as jest.Mock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user1" },
        skip: 0,
        take: 5,
        orderBy: { createdAt: "desc" },
      }),
    );
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveProperty("name", "Carro1");
  });

  it("createFavorite deve criar favorito", async () => {
    const mockFavorite = {
      id: "fav1",
      userId: "user1",
      carId: "car1",
      message: "Teste",
    };
    (prisma.favorite.create as jest.Mock).mockResolvedValue(mockFavorite);

    const result = await createFavorite("user1", "car1", "Teste");
    expect(result).toEqual(mockFavorite);
  });

  it("deleteFavorite deve deletar se existir", async () => {
    const mockFavorite = { id: "fav1" };
    (prisma.favorite.findFirst as jest.Mock).mockResolvedValue(mockFavorite);
    (prisma.favorite.delete as jest.Mock).mockResolvedValue(mockFavorite);

    const result = await deleteFavorite("user1", "car1");
    expect(result).toEqual(mockFavorite);
  });

  it("deleteFavorite deve retornar null se não existir", async () => {
    (prisma.favorite.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await deleteFavorite("user1", "car1");
    expect(result).toBeNull();
  });

  it("findFavorite deve retornar favorito se existir", async () => {
    const mockFavorite = { id: "fav1", userId: "user1", carId: "car1" };
    (prisma.favorite.findFirst as jest.Mock).mockResolvedValue(mockFavorite);

    const result = await findFavorite("user1", "car1");
    expect(result).toEqual(mockFavorite);
  });

  it("updateFavoriteMessage deve atualizar se favorito existir", async () => {
    const mockFavorite = { id: "fav1", message: "Nova mensagem" };
    (prisma.favorite.findFirst as jest.Mock).mockResolvedValue({ id: "fav1" });
    (prisma.favorite.update as jest.Mock).mockResolvedValue(mockFavorite);

    const result = await updateFavoriteMessage(
      "fav1",
      "user1",
      "Nova mensagem",
    );
    expect(result).toEqual(mockFavorite);
  });

  it("updateFavoriteMessage deve retornar null se favorito não existir", async () => {
    (prisma.favorite.findFirst as jest.Mock).mockResolvedValue(null);

    const result = await updateFavoriteMessage("fav1", "user1", "Mensagem");
    expect(result).toBeNull();
  });
});
