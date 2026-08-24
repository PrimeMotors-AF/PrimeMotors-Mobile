"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const app_1 = __importDefault(require("../../src/app"));
const favoriteService = __importStar(require("../../src/services/favoriteService"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
jest.mock("../../src/services/favoriteService");
const mockedService = favoriteService;
describe("Favorite Routes Integration", () => {
    const token = jsonwebtoken_1.default.sign({ id: "user1" }, process.env.JWT_SECRET || "secret");
    it("GET /favorites/:userId deve retornar 200 com lista", async () => {
        const mockFavorites = [{ id: "fav1", name: "Carro1" }];
        mockedService.getFavoritesByUser = jest
            .fn()
            .mockResolvedValue(mockFavorites);
        const response = await (0, supertest_1.default)(app_1.default)
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
        const response = await (0, supertest_1.default)(app_1.default)
            .get("/favorites/user1?page=2&limit=5")
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockFavorites);
        expect(mockedService.getFavoritesByUser).toHaveBeenCalledWith("user1", 2, 5);
    });
    it("POST /favorites deve criar favorito", async () => {
        const mockFavorite = { id: "fav1" };
        mockedService.createFavorite = jest.fn().mockResolvedValue(mockFavorite);
        const response = await (0, supertest_1.default)(app_1.default)
            .post("/favorites")
            .set("Authorization", `Bearer ${token}`)
            .send({ carId: "car1", message: "Gostei" });
        expect(response.status).toBe(201); // Ajuste se o status for diferente
        expect(response.body).toEqual(mockFavorite);
    });
    it("DELETE /favorites/:carId deve deletar favorito", async () => {
        mockedService.deleteFavorite = jest.fn().mockResolvedValue({ id: "fav1" });
        const response = await (0, supertest_1.default)(app_1.default)
            .delete("/favorites/car1")
            .set("Authorization", `Bearer ${token}`);
        expect(response.status).toBe(200);
    });
});
//# sourceMappingURL=favoriteRoutes.test.js.map