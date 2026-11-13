process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";

jest.mock("../../src/config/redis", () => ({
  redisClient: {
    eval: jest.fn().mockResolvedValue([1, 900_000]),
    ping: jest.fn().mockResolvedValue("PONG"),
  },
}));

import * as userService from "../../src/services/userService";
jest.mock("../../src/services/userService");
jest.mock("../../src/services/avatarUploadService", () => ({
  validateAndUploadAvatar: jest.fn().mockResolvedValue("https://example.com/avatar.png"),
}));

import request from "supertest";
import jwt from "jsonwebtoken";
import { validateAndUploadAvatar } from "../../src/services/avatarUploadService";
import app from "../../src/app";

const mockedService = userService as any;

describe("User Integration (Simulado)", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createAuthHeader = (userId: string) => {
    const secret = process.env.JWT_SECRET ?? "test_secret";
    const token = (jwt as any).sign({ id: userId }, secret, {
      expiresIn: process.env.JWT_EXPIRES_IN ?? "1d",
    });
    return `Bearer ${token}`;
  };

  it("Deve retornar 200 usando UUID válido", async () => {
    const validUuid = "550e8400-e29b-41d4-a716-446655440000";
    const mockUser = {
      id: validUuid,
      name: "Fernando Rosa",
      email: "f@f.com",
    };

    mockedService.getUserByIdService = jest.fn().mockResolvedValue(mockUser);

    const response = await request(app)
      .get(`/users/${validUuid}`)
      .set("Authorization", createAuthHeader(validUuid));

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
  });

  it("Deve retornar 404 quando o usuário não existe", async () => {
    const validUuid = "550e8400-e29b-41d4-a716-446655440001";
    mockedService.getUserByIdService = jest.fn().mockResolvedValue(null);

    const response = await request(app)
      .get(`/users/${validUuid}`)
      .set("Authorization", createAuthHeader(validUuid));

    expect(response.status).toBe(404);
  });

  it("Deve retornar 400 para UUID inválido", async () => {
    const response = await request(app)
      .get("/users/123")
      .set(
        "Authorization",
        createAuthHeader("550e8400-e29b-41d4-a716-446655440000"),
      );

    expect(response.status).toBe(400);
  });

  it("Deve exigir autenticação para atualizar o avatar", async () => {
    const validUuid = "550e8400-e29b-41d4-a716-446655440000";

    const response = await request(app).patch(`/users/${validUuid}/avatar`);

    expect(response.status).toBe(401);
  });

  it("Deve receber o avatar multipart e encaminhá-lo ao serviço de upload", async () => {
    const validUuid = "550e8400-e29b-41d4-a716-446655440000";
    const mockUser = {
      id: validUuid,
      avatarUrl: "https://example.com/avatar.png",
    };
    mockedService.updateUserAvatarService = jest.fn().mockResolvedValue(mockUser);

    const response = await request(app)
      .patch(`/users/${validUuid}/avatar`)
      .set("Authorization", createAuthHeader(validUuid))
      .attach("avatar", Buffer.from("fake image"), {
        filename: "avatar.png",
        contentType: "image/png",
      });

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockUser);
    expect(validateAndUploadAvatar).toHaveBeenCalledWith(expect.any(Buffer));
  });
});
