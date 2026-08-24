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
describe('UserService - getUserByIdService', () => {
    it('deve retornar o usuário sem o campo de password', async () => {
        const mockUser = {
            id: '123',
            name: 'Fernando',
            email: 'fer@test.com'
        };
        database_1.default.user.findUnique.mockResolvedValue(mockUser);
        const result = await (0, userService_1.getUserByIdService)('123');
        expect(result).toEqual(mockUser);
        expect(result).not.toHaveProperty('password');
    });
});
//# sourceMappingURL=getUserByIdService.test.js.map