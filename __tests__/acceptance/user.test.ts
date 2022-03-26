import app from "../../src/app";
import request from "supertest";
import mongoose from "mongoose"

describe('User Routes', () => {

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    });

    describe('GET /userinfo', () => {

        it('should return an unauthorized error if an invalid token is passed with the request', async () => {
            const response = await request(app).get('/v1/user/userinfo').auth('fakeToken', { type: 'bearer' });

            expect(response.status).toEqual(401);
            expect(response.text).toEqual('Unauthorized');
        });

        it('should return the user info if a valid token is passed with the request', async () => {
            
            const token = "GET A VALID TOKEN BEFORE TESTING";
            const response = await request(app).get('/v1/user/userinfo').auth(token, { type: 'bearer' });

            expect(response.status).toEqual(200);
            expect(response.body.email).toEqual('labeight@affecting.org');
            expect(response.body.name).toEqual('labeight');
            expect(response.body.isAdmin).toEqual(true);
        })
    })
})