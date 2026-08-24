import { loginService } from '../../src/services/userService';
import prisma from '../../src/config/database';

jest.mock('../../src/config/database', () => ({
  user: { findUnique: jest.fn() }
}));

describe('UserService - loginService', () => {
  it('deve retornar o usuário se o e-mail existir', async () => {
    const mockUser = { id: '123', email: 'test@test.com', password: 'hashed' };
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);

    const result = await loginService('test@test.com');
    expect(result).toEqual(mockUser);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email: 'test@test.com' } });
  });

  it('deve retornar null se o e-mail não existir', async () => {
    (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

    const result = await loginService('naoexiste@test.com');
    expect(result).toBeNull();
  });
});