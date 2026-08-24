"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = require("../../src/services/userService");
const database_1 = __importDefault(require("../../src/config/database"));
jest.mock("../../src/config/database", () => ({
    user: {
        findUnique: jest.fn(),
        create: jest.fn(),
    },
}));
jest.mock("bcrypt");
describe("UserService - createUserService", () => {
    it("deve lançar erro se o e-mail já estiver em uso", async () => {
        const userData = {
            name: "Teste User",
            email: "existente@teste.com",
            password: "123456",
            cpf: "12345678909",
            cep: "12345-678",
            number: "+5511999999999",
        };
        database_1.default.user.findUnique.mockResolvedValue({
            id: "1",
            ...userData,
        });
        await expect((0, userService_1.createUserService)(userData)).rejects.toThrow("E-mail já cadastrado!");
        expect(database_1.default.user.create).not.toHaveBeenCalled();
    });
});
//# sourceMappingURL=createUserService.test.js.map