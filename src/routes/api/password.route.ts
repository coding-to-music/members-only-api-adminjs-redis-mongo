import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { PasswordController } from '@controllers/password.controller';


export class PasswordRouter {

    private passwordController = new PasswordController();
    private router: CustomIRouter = Router();

    constructor() {
        this.registerRoutes()
    }

    private registerRoutes() {

        this.router.post(
            '/reset/get-code',
            this.passwordController.getVerificationCode
        );

        this.router.put(
            '/reset-password',
            this.passwordController.putResetPassword
        );

        this.router.put(
            '/change-password',
            passport.authenticate('jwt', { session: false }),
            this.passwordController.putChangePassword
        );
    }

    public getRoutes() {
        return this.router;
    }
}