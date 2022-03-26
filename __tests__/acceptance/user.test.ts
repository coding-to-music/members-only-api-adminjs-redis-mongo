import app from "../../src/app";
import request from "supertest";
import mongoose from "mongoose"

describe('users', () => {

    // beforeAll(async () => {
    //     const mongoServer = MongoMemoryServer.create();
    //     await mongoose.connect((await mongoServer).getUri());
    // });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })

    describe('GET /users', () => {
        it('should return an array of users', async () => {
            const response = await request(app).get('/v1/user/userinfo').auth('admin', 'admin');
            expect(response.status).toEqual(401);
            // expect(response.body).toEqual([]);
        });
    })
})