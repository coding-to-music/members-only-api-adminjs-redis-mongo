import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { JwtPayload, verify } from 'jsonwebtoken';
import speakeasy from 'speakeasy';
import { toDataURL } from 'qrcode';
import User from '@models/User';
import { ENV } from '@utils/validateEnv';
import { sendTokens, cookieOptions } from '@utils/lib';
import {
    ForbiddenException,
    NotFoundException,
    UnAuthorizedException,
    ValidationException,
} from '@exceptions/common.exception';
import { logger } from '@utils/logger';
import { RequestWithUser } from '@src/interfaces/users.interface';

export class AuthController {

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

                const validPassword: boolean = await user.validatePassword(password);
                if (!validPassword) throw new UnAuthorizedException('Invalid Login Credentials');

                // Check if user has 2FA enabled and respond with uesr's email & 2FA status, else
                // Generate new Tokens and send them to the client
                if (user.twoFactor.enabled) {

                    // This is to prevent users from calling the validate OTP endpoint without validating their email/passwords first
                    user.twoFactor.passwordValidated = true;
                    await user.save();

                    res.status(200).json({
                        status: 'sucess',
                        message: 'Email and Password Validated',
                        email: user.email,
                        isTwoFactorEnabled: true
                    })

                } else {

                    const { accessToken, refreshToken } = await user.generateTokens(user);
                    return sendTokens(res, refreshToken, 'Login Successful', accessToken);
                }

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
            const { accessToken, refreshToken } = await user.generateTokens(user);
            sendTokens(res, refreshToken, 'Token Refresh Successful!!!', accessToken);

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
    };

    public async registerTwofactor(req: RequestWithUser, res: Response, next: NextFunction) {
        try {

            const { user } = req;

            const { base32, otpauth_url } = speakeasy.generateSecret({
                name: 'MEMBERS ONLY'
            });

            user.twoFactor.base32Secret = base32;
            await user.save();

            const qrCode = await toDataURL(otpauth_url as string);

            res.status(200).json({
                status: 'success',
                messages: 'Secret generated successfully. Please scan the QRCode and respond with a valid token',
                qrCode
            })

        } catch (err: any) {
            console.log(err)
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

    public verifyTwoFactor = [

        body('otpToken', 'OTP Token is Required').notEmpty().isLength({ min: 6, max: 6 }).withMessage('Token must be six characters long').trim().escape(),

        async (req: RequestWithUser, res: Response, next: NextFunction) => {
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) throw new ValidationException(errors.array());

                const { otpToken } = req.body;
                const { user } = req;
                const { twoFactor } = user;

                const isVerified = speakeasy.totp.verify({
                    secret: twoFactor.base32Secret,
                    encoding: 'base32',
                    token: otpToken
                });

                if (isVerified) {

                    user.twoFactor.enabled = true;
                    await user.save();

                    res.status(200).json({
                        status: 'success',
                        message: '2FA Enabled Successfully'
                    })

                } else {
                    throw new ForbiddenException('Invalid OTP Token')
                }

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
    ]

    public validateTwoFactor = [

        body('email').notEmpty().isEmail().withMessage('Email is required and must be a valid email').trim().escape(),
        body('otpToken', 'OTP Token is Required').notEmpty().isLength({ min: 6, max: 6 }).withMessage('Token must be six characters long').trim().escape(),

        async (req: Request, res: Response, next: NextFunction) => {
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) throw new ValidationException(errors.array());

                const { email, otpToken } = req.body;

                const userExists = await User.findOne({ email }).exec();

                if (userExists) {

                    const { twoFactor } = userExists;

                    if (!twoFactor.passwordValidated) throw new UnAuthorizedException('Please Validate Your Password To Proceed')

                    const isVerified = speakeasy.totp.verify({
                        secret: twoFactor.base32Secret,
                        encoding: 'base32',
                        token: otpToken,
                        window: 1
                    });

                    if (isVerified) {

                        // Reverse Password Validated state to default
                        // This is to prevent users from calling the validate OTP endpoint without validating their email/passwords first
                        userExists.twoFactor.passwordValidated = false;
                        await userExists.save()

                        const { accessToken, refreshToken } = await userExists.generateTokens(userExists);
                        return sendTokens(res, refreshToken, 'Login Successful', accessToken);
                    }

                    throw new UnAuthorizedException('Invalid Login Credentials')

                } else {
                    throw new UnAuthorizedException('Invalid Login Credentials');
                }

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
    ]
}