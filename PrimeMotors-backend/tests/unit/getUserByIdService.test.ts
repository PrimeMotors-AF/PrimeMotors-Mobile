import { getUserByIdService } from '../../src/services/userService';
import prisma from '../../src/config/database';

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

    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await getUserByIdService('123');

    expect(result).toEqual(mockUser);
    expect(result).not.toHaveProperty('password'); 
  });
});