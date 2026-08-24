import request from "supertest";
import app from "../../src/app";
import * as favoriteService from "../../src/services/favoriteService";
import jwt from "jsonwebtoken";

jest.mock("../../src/services/favoriteService");
const mockedService = favoriteService as any;

describe("Favorite Routes Integration", () => {
  const token = jwt.sign({ id: "user1" }, process.env.JWT_SECRET || "secret");

  it("GET /favorites/:userId deve retornar 200 com lista", async () => {
    const mockFavorites = [{ id: "fav1", name: "Carro1" }];
    mockedService.getFavoritesByUser = jest
      .fn()
      .mockResolvedValue(mockFavorites);

    const response = await request(app)
      .get("/favorites/user1")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockFavorites);
  });

  it("GET /favorites/:userId deve aceitar paginação via query page e limit", async () => {
    const mockFavorites = [{ id: "fav2", name: "Carro2" }];
    mockedService.getFavoritesByUser = jest
      .fn()
      .mockResolvedValue(mockFavorites);

    const response = await request(app)
      .get("/favorites/user1?page=2&limit=5")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockFavorites);
    expect(mockedService.getFavoritesByUser).toHaveBeenCalledWith(
      "user1",
      2,
      5,
    );
  });

  it("POST /favorites deve criar favorito", async () => {
    const mockFavorite = { id: "fav1" };
    mockedService.createFavorite = jest.fn().mockResolvedValue(mockFavorite);

    const response = await request(app)
      .post("/favorites")
      .set("Authorization", `Bearer ${token}`)
      .send({ carId: "car1", message: "Gostei" });
    expect(response.status).toBe(201); // Ajuste se o status for diferente
    expect(response.body).toEqual(mockFavorite);
  });

  it("DELETE /favorites/:carId deve deletar favorito", async () => {
    mockedService.deleteFavorite = jest.fn().mockResolvedValue({ id: "fav1" });

    const response = await request(app)
      .delete("/favorites/car1")
      .set("Authorization", `Bearer ${token}`);
    expect(response.status).toBe(200);
  });
});
