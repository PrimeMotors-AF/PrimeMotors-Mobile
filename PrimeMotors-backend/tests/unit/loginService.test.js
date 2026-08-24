"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const userService_1 = require("../../src/services/userService");
const database_1 = __importDefault(require("../../src/config/database"));
jest.mock('../../src/config/database', () => ({
    user: { findUnique: jest.fn() }
}));
describe('UserService - loginService', () => {
    it('deve retornar o usuário se o e-mail existir', async () => {
        const mockUser = { id: '123', email: 'test@test.com', password: 'hashed' };
        database_1.default.user.findUnique.mockResolvedValue(mockUser);
        const result = await (0, userService_1.loginService)('test@test.com');
        expect(result).toEqual(mockUser);
        expect(database_1.default.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
    });
    it('deve retornar null se o e-mail não existir', async () => {
        database_1.default.user.findUnique.mockResolvedValue(null);
        const result = await (0, userService_1.loginService)('naoexiste@test.com');
        expect(result).toBeNull();
    });
});
//# sourceMappingURL=loginService.test.js.map