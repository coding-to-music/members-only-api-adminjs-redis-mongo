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
    ValidationBodyException,
} from '@exceptions/commonExceptions';

export const postLoginUser = [

    body('email').notEmpty().isEmail().withMessage('Email is required and must be a valid email'),
    body('password').notEmpty().isLength({ min: 6 }).withMessage('Password is required and must be at least 6 characters long'),

    async (req: Request, res: Response, next: NextFunction) => {

        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) throw new ValidationBodyException(errors.array())

            const { email } = req.body;
            const user = await User.findOne({ email }).exec();
            if (!user) throw new NotFoundException(`User with email: ${email} not found`)

            const validPassword: boolean = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) throw new UnAuthorizedException('Invalid Login Credentials');

            // Generate new Tokens and send them to the client
            const { token, refresh_token } = await user.generateTokens(user);
            sendTokens(res, refresh_token, 'Login Successful', token);
        } catch (err) {
            console.log(err)
            next(err);
        }
    }
]

export const getLogoutUser = (req: Request, res: Response, next: NextFunction) => {
    try {
        return res
            .clearCookie('jit', cookieOptions)
            .json({
                status: 'success',
                message: 'Logout successful'
            });
    } catch (error) {
        next(error)
    }
};

export const postRefreshToken = async (req: Request, res: Response, next: NextFunction) => {

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
        if (!refreshTokenNotExpired) throw new ForbiddenException('Refresh token has expired, please initiate a new sign in request');
        if (!tokenVersionValid) throw new ForbiddenException('Token Invalid')

        // Generate new Tokens and send them to the client
        const { token, refresh_token } = await user.generateTokens(user);
        sendTokens(res, refresh_token, 'Token Refresh Successful!!!', token);
    } catch (err) {
        next(err);
    }
}