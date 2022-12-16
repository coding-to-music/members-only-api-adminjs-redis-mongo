import { App } from "@/app";
import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { User } from "@user/models/user.model"

beforeAll(async () => {

    const mongoServer = await MongoMemoryServer.create();
    mongoose.set('strictQuery', false)
    await mongoose.connect(mongoServer.getUri());
})

afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
});

describe('User Routes', () => {

    const app = new App().getApp();

    describe('GET /userinfo', () => {

        it('should return an unauthorized error if an invalid token is passed with the request', async () => {
            const response = await request(app).get('/v1/users/userinfo').auth('fakeToken', { type: 'bearer' });

            expect(response.status).toEqual(401);
            expect(response.text).toEqual('Unauthorized');
        });

        it('should return the user info if a valid token is passed with the request', async () => {
            const user = new User({
                name: 'test user',
                email: 'test@test.com',
                password: 'password',
                avatar: '',
                roles: ['ADMIN']
            });

            await user.save();

            const token = (await request(app).post('/v1/auth/login').send({ email: 'test@test.com', password: 'password' }).retry(2)).body.data.accessToken;

            const response = await request(app).get('/v1/users/userinfo').auth(token, { type: 'bearer' });

            expect(response.status).toEqual(200);
            expect(response.body.data.email).toEqual('test@test.com');
            expect(response.body.data.name).toEqual('test user');
            expect(response.body.data.roles).toEqual(['ADMIN']);
        })
    })
})