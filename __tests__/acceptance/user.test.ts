import app from '@/app';
import request from 'supertest';
import mongoose from 'mongoose'
import { connectDatabase } from '@config/database'

beforeAll(() => connectDatabase())

afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
});

describe('User Routes', () => {

    describe('GET /userinfo', () => {

        it('should return an unauthorized error if an invalid token is passed with the request', async () => {
            const response = await request(app).get('/v1/users/userinfo').auth('fakeToken', { type: 'bearer' });

            expect(response.status).toEqual(401);
            expect(response.text).toEqual('Unauthorized');
        });

        it('should return the user info if a valid token is passed with the request', async () => {

            const token = (await request(app).post('/v1/auth/login').send({ email: 'labeight@affecting.org', password: 'password123' }).retry(2)).body.authToken;
            const response = await request(app).get('/v1/users/userinfo').auth(token, { type: 'bearer' });

            expect(response.status).toEqual(200);
            expect(response.body.email).toEqual('labeight@affecting.org');
            expect(response.body.name).toEqual('Lab Eight');
            expect(response.body.roles).toEqual(['ADMIN']);
        })
    })
})