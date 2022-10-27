import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { AuthController } from '@src/controllers/auth.controller';

import { AuthRequestValidator } from '@middlewares/validations/auth.validation'


export class AuthRouter {

    private router: CustomIRouter;
    private authController: AuthController;
    private authRequestValidator: AuthRequestValidator;

    constructor() {
        this.router = Router();
        this.authController = new AuthController()
        this.authRequestValidator = new AuthRequestValidator()
        this.registerRoutes();
    }

    private registerRoutes() {

        this.router.post(
            '/login',
            this.authRequestValidator.loginUserValidator,
            this.authController.loginUser
        );

        this.router.post(
            '/logout',
            this.authController.logoutUser
        );

        this.router.post(
            '/refresh-token',
            this.authController.refreshToken
        );

        this.router.post(
            '/2fa/register',
            passport.authenticate('jwt', { session: false }),
            this.authController.registerTwofactor
        );

        this.router.post(
            '/2fa/verify',
            passport.authenticate('jwt', { session: false }),
            this.authRequestValidator.verifyTwofactorValidator,
            this.authController.verifyTwoFactor
        );

        this.router.post(
            '/2fa/validate',
            this.authRequestValidator.validateTwoFactorValidator,
            this.authController.validateTwoFactor
        )

        this.router.post(
            '/get-code',
            this.authRequestValidator.getVerificationCodeValidator,
            this.authController.getVerificationCode
        );

        this.router.post(
            '/reset-password',
            this.authRequestValidator.resetPasswordValidator,
            this.authController.resetPassword
        );

        this.router.post(
            '/change-password',
            passport.authenticate('jwt', { session: false }),
            this.authRequestValidator.changePasswordValidator,
            this.authController.changePassword
        );
    }

    public getRoutes() {
        return this.router;
    }
}