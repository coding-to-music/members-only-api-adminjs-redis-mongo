import app from "../../src/app";
import request from "supertest";
import mongoose from "mongoose"

describe('authentication routes', () => {

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoose.connection.close();
    })

    describe('POST /auth/login', () => {
        
        it('should successfully login the user', async () => {
            const response = await request(app).post('/v1/auth/login').send({ email: 'labeight@affecting.org', password: 'password123' }).retry(2);

            expect(response.status).toEqual(200);
            expect(response.body).toEqual({ authToken: expect.any(String), message: expect.any(String) });
            expect(response.body).toHaveProperty('authToken');
        });

        it('should return an error if the email is not provided', async () => {
            const response = await request(app).post('/v1/auth/login').send({ password: 'password123' }).retry(2);

            expect(response.status).toEqual(400);
            expect(response.body).toEqual([{"location": "body", "msg": "Email is required and must be a valid email", "param": "email"}, {"location": "body", "msg": "Email is required and must be a valid email", "param": "email"}]);
        });
    })
})