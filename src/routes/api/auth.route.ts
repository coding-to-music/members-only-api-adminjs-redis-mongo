import { Router } from 'express';
import { CustomIRouter } from '@interfaces/routes.interface';
import { AuthController } from '@src/controllers/auth.controller';


export class AuthRouter {

    private authController = new AuthController();
    private router: CustomIRouter = Router();

    constructor() {
        this.registerRoutes();
    }

    private registerRoutes() {

        this.router.get('/logout', this.authController.getLogoutUser);
        this.router.post('/login', this.authController.postLoginUser);
        this.router.post('/refresh-token', this.authController.postRefreshToken);
    }

    public getRoutes() {
        return this.router;
    }
}