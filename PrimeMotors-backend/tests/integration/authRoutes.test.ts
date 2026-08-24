import request from 'supertest';
import app from '../../src/app';
import * as userService from '../../src/services/userService';
import bcrypt from 'bcrypt';

jest.mock('../../src/services/userService');
jest.mock('bcrypt');
const mockedService = userService as any;
const mockedBcrypt = bcrypt as jest.Mocked<typeof bcrypt>;
(mockedBcrypt.compare as jest.Mock).mockResolvedValue(true);

describe('Auth Routes Integration', () => {
  beforeAll(() => {
    process.env.JWT_SECRET = 'test_secret';
    process.env.JWT_EXPIRES_IN = '1h';
  });

  it('POST /auth/login deve retornar token se válido', async () => {
    const mockUser = { id: '123', email: 'test@test.com', password: 'hashed', active: true };
    mockedService.loginService = jest.fn().mockResolvedValue(mockUser);
    //mockedBcrypt.compare.mockResolvedValue(true);

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'test@test.com', password: '123' });
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('token');
  });

  it('POST /auth/login deve retornar 401 se inválido', async () => {
    mockedService.loginService = jest.fn().mockResolvedValue(null);

    const response = await request(app)
      .post('/auth/login')
      .send({ email: 'wrong@test.com', password: '123' });
    expect(response.status).toBe(401);
  });

  it('POST /auth/users deve criar usuário', async () => {
    const mockUser = { id: '123', email: 'new@test.com' };
    mockedService.createUserService = jest.fn().mockResolvedValue(mockUser);

    const response = await request(app)
      .post('/auth/users')
      .send({ name: 'Novo', email: 'new@test.com', password: '123' });
    expect(response.status).toBe(201);
    expect(response.body).toEqual({ user: mockUser });
  });
});