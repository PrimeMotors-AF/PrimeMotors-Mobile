import { createUserService } from "../../src/services/userService";
import prisma from "../../src/config/database";
import bcrypt from "bcrypt";

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

    (prisma.user.findUnique as jest.Mock).mockResolvedValue({
      id: "1",
      ...userData,
    });

    await expect(createUserService(userData)).rejects.toThrow(
      "E-mail já cadastrado!",
    );

    expect(prisma.user.create).not.toHaveBeenCalled();
  });
});
