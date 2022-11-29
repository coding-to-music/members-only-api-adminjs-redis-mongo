import { App } from '@/app';
import request from 'supertest';
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server';
import User from '@models/User'

beforeAll(async () => {

    const mongoServer = await MongoMemoryServer.create();

    await mongoose.connect(mongoServer.getUri())
})

afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
})

describe('authentication routes', () => {

    const app = new App().getApp();

    describe('POST /auth/login', () => {

        it('should successfully login the user', async () => {
            
            const user = new User({
                name: 'test user',
                email: 'test@test.com',
                password: 'password',
                avatar: ''
            });
        
            await user.save();
            
            const response = await request(app).post('/v1/auth/login').send({ email: 'test@test.com', password: 'password' }).retry(2);

            expect(response.status).toEqual(200);
            expect(response.body).toEqual({ 
                data: expect.any(Object), 
                message: expect.any(String),
                status: 'success',
                statusCode: 200
             });
            expect(response.body).toHaveProperty('data');
        });

        it('should return an error if the email is not provided', async () => {
            const response = await request(app).post('/v1/auth/login').send({ password: 'password123' }).retry(2);

            expect(response.status).toEqual(400);
            expect(response.body).toEqual({
                "error": "Validation Errors",
                "statusCode": 400,
                "errorType": "ValidationException",
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
            const response = await request(app).post('/v1/auth/login').send({ email: 'test@test.com' }).retry(2);

            expect(response.status).toEqual(400);
            expect(response.body).toEqual({
                "error": "Validation Errors",
                "statusCode": 400,
                "errorType": "ValidationException",
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
            const response = await request(app).post('/v1/auth/login').send({ email: 'test@noexist.com', password: 'password123' }).retry(2);

            expect(response.status).toEqual(404);
            expect(response.body).toEqual({
                error: 'User with email: test@noexist.com not found',
                errorType: 'NotFoundException',
                statusCode: 404
            });
        });

        it('should return an error if the password is incorrect', async () => {
            const response = await request(app).post('/v1/auth/login').send({ email: 'test@test.com', password: 'password1234' }).retry(2);

            expect(response.status).toEqual(401);
            expect(response.body).toEqual({
                error: 'Invalid Login Credentials',
                errorType: 'UnAuthorizedException',
                statusCode: 401
            });
        });
    })
})