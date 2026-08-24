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
process.env.JWT_SECRET = process.env.JWT_SECRET || "test_secret";
process.env.JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "1d";
const userService = __importStar(require("../../src/services/userService"));
jest.mock("../../src/services/userService");
const supertest_1 = __importDefault(require("supertest"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const app_1 = __importDefault(require("../../src/app"));
const mockedService = userService;
describe("User Integration (Simulado)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    const createAuthHeader = (userId) => {
        const secret = process.env.JWT_SECRET ?? "test_secret";
        const token = jsonwebtoken_1.default.sign({ id: userId }, secret, {
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
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/users/${validUuid}`)
            .set("Authorization", createAuthHeader(validUuid));
        expect(response.status).toBe(200);
        expect(response.body).toEqual(mockUser);
    });
    it("Deve retornar 404 quando o usuário não existe", async () => {
        const validUuid = "550e8400-e29b-41d4-a716-446655440001";
        mockedService.getUserByIdService = jest.fn().mockResolvedValue(null);
        const response = await (0, supertest_1.default)(app_1.default)
            .get(`/users/${validUuid}`)
            .set("Authorization", createAuthHeader(validUuid));
        expect(response.status).toBe(404);
    });
    it("Deve retornar 400 para UUID inválido", async () => {
        const response = await (0, supertest_1.default)(app_1.default)
            .get("/users/123")
            .set("Authorization", createAuthHeader("550e8400-e29b-41d4-a716-446655440000"));
        expect(response.status).toBe(400);
    });
});
//# sourceMappingURL=userRoutes.test.js.map