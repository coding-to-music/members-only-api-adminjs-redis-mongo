import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { authorizeUser } from '@middlewares/middleware';
import { UserController } from '@src/controllers/user.controller';


export class UserRouter {

    private userController = new UserController();
    private router: CustomIRouter = Router();

    constructor() {
        this.registerRoutes()
    }

    private registerRoutes() {

        this.router.get('/all', passport.authenticate('jwt', { session: false }), authorizeUser, this.userController.getAllUsers)
        this.router.get('/userinfo', passport.authenticate('jwt', { session: false }), this.userController.getCurrentUser);
        this.router.post('/register', this.userController.postCreateUser);
        this.router.delete('/delete-user', passport.authenticate('jwt', { session: false }), this.userController.deleteUser);
    };

    public getRoutes() {
        return this.router;
    }
}