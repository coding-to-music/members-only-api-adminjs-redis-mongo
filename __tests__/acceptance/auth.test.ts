import app from '@/app';
import request from 'supertest';
import mongoose from 'mongoose'
import { connectDB } from '@config/database'

beforeAll(() => connectDB())

afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
})

describe('authentication routes', () => {

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
            expect(response.body).toEqual({
                "error": "Validation Errors",
                "statusCode": 400,
                "name": "ValidationException",
                "errors": [
                    {
                        "msg": "Invalid value",
                        "param": "email",
                        "location": "body"
                    },
                    {
                        "msg": "Email is required and must be a valid email",
                        "param": "email",
                        "location": "body"
                    }
                ]
            });
        });

        it('should return an error if the password is not provided', async () => {
            const response = await request(app).post('/v1/auth/login').send({ email: 'labeight@affecting.org' }).retry(2);

            expect(response.status).toEqual(400);
            expect(response.body).toEqual({
                "error": "Validation Errors",
                "statusCode": 400,
                "name": "ValidationException",
                "errors": [
                    {
                        "msg": "Invalid value",
                        "param": "password",
                        "location": "body"
                    },
                    {
                        "msg": "Password is required and must be at least 6 characters long",
                        "param": "password",
                        "location": "body"
                    }
                ]
            });
        });

        it('should return an error if the email is not registered', async () => {
            const response = await request(app).post('/v1/auth/login').send({ email: 'labeight@afterlife.com', password: 'password123' }).retry(2);

            expect(response.status).toEqual(404);
            expect(response.body).toEqual({
                error: 'User with email: labeight@afterlife.com not found',
                name: 'NotFoundException',
                statusCode: 404
            });
        });

        it('should return an error if the password is incorrect', async () => {
            const response = await request(app).post('/v1/auth/login').send({ email: 'labeight@affecting.org', password: 'password1234' }).retry(2);

            expect(response.status).toEqual(401);
            expect(response.body).toEqual({
                error: 'Invalid Login Credentials',
                name: 'UnAuthorizedException',
                statusCode: 401
            });
        });
    })
})