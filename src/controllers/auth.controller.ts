import { NextFunction, Request, Response } from 'express';
import { body, validationResult } from 'express-validator';
import { logger } from '@utils/logger';
import { cookieOptions, SuccessResponse } from '@utils/lib';
import {
    NotFoundException,
    ValidationException,
} from '@exceptions/common.exception';
import { RequestWithUser } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';

export class AuthController {

    private readonly authService = new AuthService();

    public postLoginUser = [

        body('email').notEmpty().isEmail().withMessage('Email is required and must be a valid email'),
        body('password').notEmpty().isLength({ min: 6 }).withMessage('Password is required and must be at least 6 characters long'),

        async (req: Request, res: Response, next: NextFunction) => {

            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) throw new ValidationException(errors.array());

                const { email, password } = req.body

                const responseData = await this.authService.loginUser(email, password);

                const { is2FAEnabled } = responseData

                if (is2FAEnabled) {

                    res.status(200).json(new SuccessResponse(200, 'Email and Password Validated', responseData))

                } else {

                    const { refreshToken, ...data } = responseData;

                    res
                        .cookie('jit', refreshToken, cookieOptions)
                        .json(new SuccessResponse(200, 'Login Successful', data));
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
                .json(new SuccessResponse(200, 'Logout Successful'));

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

    public postRefreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { jit } = req.signedCookies;
            if (!jit) throw new NotFoundException('Refresh Token not found');

            const { refreshToken, ...data } = await this.authService.postRefreshToken(jit);

            res
                .cookie('jit', refreshToken, cookieOptions)
                .json(new SuccessResponse(200, 'Token Refresh Successful', data));

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

    public registerTwofactor = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { user } = req;

            const qrCode = await this.authService.registerTwofactor(user);

            res.status(200).json(new SuccessResponse(
                200,
                'Secret generated successfully. Please scan the QRCode and respond with a valid token',
                qrCode
            ))

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
    };

    public verifyTwoFactor = [

        body('otpToken', 'OTP Token is Required').notEmpty().isLength({ min: 6, max: 6 }).withMessage('Token must be six characters long').trim().escape(),

        async (req: RequestWithUser, res: Response, next: NextFunction) => {
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) throw new ValidationException(errors.array());

                const { otpToken } = req.body;
                const { user } = req;

                await this.authService.verifyTwoFactor(otpToken, user);

                res.status(200).json(new SuccessResponse(200, '2FA Enabled Successfully'))

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

    public loginValidateTwoFactor = [

        body('email').notEmpty().isEmail().withMessage('Email is required and must be a valid email').trim().escape(),
        body('otpToken', 'OTP Token is Required').notEmpty().isLength({ min: 6, max: 6 }).withMessage('Token must be six characters long').trim().escape(),

        async (req: Request, res: Response, next: NextFunction) => {
            try {

                const errors = validationResult(req);
                if (!errors.isEmpty()) throw new ValidationException(errors.array());

                const { email, otpToken } = req.body;

                const responseData = await this.authService.loginValidateTwoFactor(email, otpToken)

                const { refreshToken, ...data } = responseData;

                res
                    .cookie('jit', refreshToken, cookieOptions)
                    .json(new SuccessResponse(200, 'Login Successful', data));

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