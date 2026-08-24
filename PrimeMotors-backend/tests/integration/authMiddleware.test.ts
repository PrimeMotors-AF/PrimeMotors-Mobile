import request from 'supertest';
import app from '../../src/app';
import * as userService from '../../src/services/userService';
import jwt from 'jsonwebtoken';

jest.mock('jsonwebtoken');
const mockedJwt = jwt as jest.Mocked<typeof jwt>;

jest.mock('../../src/services/userService');
const mockedService = userService as any;

describe('Verificação do AuthMiddleware', () => {

    it('Deve barrar a requisição (401) se o token não for enviado', async () => {
        const response = await request(app).delete('/users/123');

        expect(response.status).toBe(401);
        expect(response.body).toHaveProperty('message');
    });

    it('Deve permitir a requisição se um token válido for enviado', async () => {
        mockedJwt.verify.mockImplementation(() => ({ id: '123', name: 'User Teste' }));

        const response = await request(app)
            .delete('/users/123')
            .set('Authorization', 'Bearer qualquer_string_aqui'); 

        expect(response.status).not.toBe(401);
    });
});