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
            '/login/validate-2fa',
            this.authRequestValidator.loginValidateTwoFactorValidator,
            this.authController.loginValidateTwoFactor
        )

        this.router.post(
            '/logout',
            this.authController.getLogoutUser
        );

        this.router.post(
            '/refresh-token',
            this.authController.postRefreshToken
        );

        this.router.post(
            '/register-2fa',
            passport.authenticate('jwt', { session: false }),
            this.authController.registerTwofactor
        );

        this.router.post(
            '/verify-2fa',
            passport.authenticate('jwt', { session: false }),
            this.authRequestValidator.verifyTwofactorValidator,
            this.authController.verifyTwoFactor
        );
    }

    public getRoutes() {
        return this.router;
    }
}