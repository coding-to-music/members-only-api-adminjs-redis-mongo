import app from "../../src/app";
import request from "supertest";
import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose"

describe('users', () => {

    beforeAll(async () => {
        const mongoServer = MongoMemoryServer.create();
        await mongoose.connect((await mongoServer).getUri());
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })

    describe('GET /users', () => {
        it('should return an array of users', async () => {
            const response = await request(app).get('/v1/user/userinfo');
            expect(response.status).toBe(200);
            // expect(response.body).toEqual([]);
        });
    })
})