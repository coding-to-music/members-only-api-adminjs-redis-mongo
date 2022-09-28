import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { AuthController } from '@src/controllers/auth.controller';


export class AuthRouter {

    private authController = new AuthController();
    private router: CustomIRouter = Router();

    constructor() {
        this.registerRoutes();
    }

    private registerRoutes() {

        this.router.post('/login', this.authController.postLoginUser);
        this.router.post('/login/validate-2fa', this.authController.loginValidateTwoFactor)
        this.router.post('/logout', this.authController.getLogoutUser);
        this.router.post('/refresh-token', this.authController.postRefreshToken);
        this.router.post('/register-2fa', passport.authenticate('jwt', { session: false }), this.authController.registerTwofactor);
        this.router.post('/verify-2fa', passport.authenticate('jwt', { session: false }), this.authController.verifyTwoFactor);
    }

    public getRoutes() {
        return this.router;
    }
}