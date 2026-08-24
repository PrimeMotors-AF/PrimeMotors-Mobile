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
const userService = __importStar(require("../../src/services/userService"));
const bcrypt_1 = __importDefault(require("bcrypt"));
jest.mock('../../src/services/userService');
jest.mock('bcrypt');
const mockedService = userService;
const mockedBcrypt = bcrypt_1.default;
mockedBcrypt.compare.mockResolvedValue(true);
describe('Auth Routes Integration', () => {
    beforeAll(() => {
        process.env.JWT_SECRET = 'test_secret';
        process.env.JWT_EXPIRES_IN = '1h';
    });
    it('POST /auth/login deve retornar token se válido', async () => {
        const mockUser = { id: '123', email: 'test@test.com', password: 'hashed', active: true };
        mockedService.loginService = jest.fn().mockResolvedValue(mockUser);
        //mockedBcrypt.compare.mockResolvedValue(true);
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({ email: 'test@test.com', password: '123' });
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });
    it('POST /auth/login deve retornar 401 se inválido', async () => {
        mockedService.loginService = jest.fn().mockResolvedValue(null);
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/auth/login')
            .send({ email: 'wrong@test.com', password: '123' });
        expect(response.status).toBe(401);
    });
    it('POST /auth/users deve criar usuário', async () => {
        const mockUser = { id: '123', email: 'new@test.com' };
        mockedService.createUserService = jest.fn().mockResolvedValue(mockUser);
        const response = await (0, supertest_1.default)(app_1.default)
            .post('/auth/users')
            .send({ name: 'Novo', email: 'new@test.com', password: '123' });
        expect(response.status).toBe(201);
        expect(response.body).toEqual(mockUser);
    });
});
//# sourceMappingURL=authRoutes.test.js.map