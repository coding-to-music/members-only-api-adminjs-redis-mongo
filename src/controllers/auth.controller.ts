import { NextFunction, Request, Response } from 'express';
import { logger } from '@utils/logger';
import { cookieOptions, SuccessResponse } from '@utils/lib';
import { LoggerException, NotFoundException } from '@exceptions/common.exception';
import { RequestWithUser } from '@interfaces/users.interface';
import { AuthService } from '@services/auth.service';
import { Controller } from '@decorators/common.decorator';


@Controller()
export class AuthController {

    private readonly authService: AuthService;

    constructor() {
        this.authService = new AuthService()
    }

    public loginUser = async (req: Request, res: Response, next: NextFunction) => {
        try {

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

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

    public logoutUser(req: Request, res: Response, next: NextFunction) {
        try {

            return res
                .clearCookie('jit', cookieOptions)
                .json(new SuccessResponse(200, 'Logout Successful'));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public refreshToken = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { jit } = req.signedCookies;
            if (!jit) throw new NotFoundException('Refresh Token not found');

            const { refreshToken, ...data } = await this.authService.refreshToken(jit);

            res
                .cookie('jit', refreshToken, cookieOptions)
                .json(new SuccessResponse(200, 'Token Refresh Successful', data));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
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

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    };

    public verifyTwoFactor = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { otpToken } = req.body;
            const { user } = req;

            await this.authService.verifyTwoFactor(otpToken, user);

            res.status(200).json(new SuccessResponse(200, '2FA Enabled Successfully'))

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

    public validateTwoFactor = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { email, otpToken } = req.body;

            const responseData = await this.authService.validateTwoFactor(email, otpToken)

            const { refreshToken, ...data } = responseData;

            res
                .cookie('jit', refreshToken, cookieOptions)
                .json(new SuccessResponse(200, 'Login Successful', data));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

    public getVerificationCode = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { email } = req.body;

            await this.authService.getVerificationCode(email)

            res.json(new SuccessResponse(200, 'Verification Code sent'));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

    public resetPassword = async (req: Request, res: Response, next: NextFunction) => {
        try {

            const { body } = req;

            const data = await this.authService.resetPassword(body);

            res.json(new SuccessResponse(200, 'Password Reset Successful', data));

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }

    public changePassword = async (req: RequestWithUser, res: Response, next: NextFunction) => {
        try {

            const { currentPassword, newPassword } = req.body;

            const { _id } = req.user;

            const data = await this.authService.changePassword(_id, currentPassword, newPassword);

            res.json(new SuccessResponse(200, 'Password Changed', data))

        } catch (error: any) {
            logger.error(JSON.stringify(new LoggerException(error, req)), error);
            next(error)
        }
    }
}