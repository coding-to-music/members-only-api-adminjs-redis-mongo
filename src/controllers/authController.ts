import User from '@models/User';
import { body, validationResult } from 'express-validator';
import { JwtPayload, verify } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ENV } from '@utils/validateEnv';
import { Request, Response, NextFunction } from 'express';
import { sendTokens, cookieOptions } from '@utils/lib';
import {
    ForbiddenException,
    NotFoundException,
    UnAuthorizedException,
    ValidationException,
} from '@exceptions/commonExceptions';
import { logger } from '@utils/logger';

class AuthController {

    public postLoginUser = [

        body('email').notEmpty().isEmail().withMessage('Email is required and must be a valid email'),
        body('password').notEmpty().isLength({ min: 6 }).withMessage('Password is required and must be at least 6 characters long'),

        async (req: Request, res: Response, next: NextFunction) => {

            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) throw new ValidationException(errors.array());

                const { email, password } = req.body

                const user = await User.findOne({ email }).exec();
                if (!user) throw new NotFoundException(`User with email: ${email} not found`)

                const validPassword: boolean = await bcrypt.compare(password, user.password);
                if (!validPassword) throw new UnAuthorizedException('Invalid Login Credentials');

                // Generate new Tokens and send them to the client
                const { token, refresh_token } = await user.generateTokens(user);
                sendTokens(res, refresh_token, 'Login Successful', token);
            } catch (err: any) {

                logger.error(`
                ${err.statusCode || 500} - 
                ${err.error || 'Something Went Wrong'} - 
                ${req.originalUrl} - 
                ${req.method} - 
                ${req.ip}
                `, err);
                next(err);
            }
        }
    ];

    public getLogoutUser(req: Request, res: Response, next: NextFunction) {
        try {
            return res
                .clearCookie('jit', cookieOptions)
                .json({
                    status: 'success',
                    message: 'Logout successful'
                });
        } catch (err: any) {

            logger.error(`
                ${err.statusCode || 500} - 
                ${err.error || 'Something Went Wrong'} - 
                ${req.originalUrl} - 
                ${req.method} - 
                ${req.ip}
                `);
            next(err)
        }
    };

    public async postRefreshToken(req: Request, res: Response, next: NextFunction) {

        try {

            const { jit } = req.signedCookies;
            if (!jit) throw new NotFoundException('Refresh Token not found');

            // Verify refresh token in request
            const REFRESH_TOKEN_PUBLIC_KEY = Buffer.from(ENV.REFRESH_TOKEN_PUBLIC_KEY_BASE64, 'base64').toString('ascii');
            const verifiedToken = verify(jit, REFRESH_TOKEN_PUBLIC_KEY) as JwtPayload;

            // Check if user exists in DB
            const user = await User.findOne({ _id: verifiedToken.sub });
            if (!user) throw new NotFoundException('User not found');

            // Check if refresh token is valid
            const { validToken, refreshTokenNotExpired, tokenVersionValid } = await user.validateRefreshToken(jit, verifiedToken.tokenVersion);
            if (!validToken) throw new ForbiddenException('Invalid Refresh token');
            if (!refreshTokenNotExpired) throw new ForbiddenException('Refresh Token has expired, Please initiate a new login request');
            if (!tokenVersionValid) throw new ForbiddenException('Token Invalid')

            // Generate new Tokens and send them to the client
            const { token, refresh_token } = await user.generateTokens(user);
            sendTokens(res, refresh_token, 'Token Refresh Successful!!!', token);
        } catch (err: any) {

            logger.error(`
                ${err.statusCode || 500} - 
                ${err.error || 'Something Went Wrong'} - 
                ${req.originalUrl} - 
                ${req.method} - 
                ${req.ip}
                `);
            next(err);
        }
    }
}

export default new AuthController()