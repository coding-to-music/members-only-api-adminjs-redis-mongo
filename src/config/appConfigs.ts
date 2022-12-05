import { CorsOptions } from 'cors';
import { CookieOptions } from 'express';
import rateLimit from 'express-rate-limit'

export const whitelist: string[] = [
    'https://localhost:3000',
    'http://localhost:3000',
    'https://members-o.netlify.app'
];

export const corsOptions: CorsOptions = {
    credentials: true,
    methods: ['GET', 'DELETE', 'OPTIONS', 'POST', 'PUT', 'PATCH'],
    origin: (requestOrigin: string | undefined, callback) => {
        if (whitelist.indexOf(requestOrigin as string) !== -1 || !requestOrigin) {
            callback(null, true)
        } else {
            callback(new Error('Not allowed by CORS'))
        }
    }
};

export const cookieOptions: CookieOptions = {
    path: '/v1/auth/refresh-token',
    httpOnly: true,
    maxAge: 604800000,
    signed: true,
    sameSite: 'none',
    secure: true,
};

export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    standardHeaders: true,
    legacyHeaders: false,
    message: 'Too many requests, please try again later.',
    skipSuccessfulRequests: true,
    skip: (req, res) => whitelist.includes(req.headers.origin as string)
})