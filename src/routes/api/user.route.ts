import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { UserController } from '@controllers/user.controller';
import { UserRequestValidator } from '@middlewares/validations/user.validation';


export class UserRouter {

    private router: CustomIRouter;
    private userController: UserController;
    private userRequestValidator: UserRequestValidator;

    constructor() {
        this.router = Router();
        this.userController = new UserController();
        this.userRequestValidator = new UserRequestValidator();
        this.registerRoutes()
    }

    private registerRoutes() {

        this.router.get(
            '/userinfo',
            passport.authenticate('jwt', { session: false }),
            this.userController.getCurrentUser
        );

        this.router.post(
            '/',
            this.userRequestValidator.createUserValidator,
            this.userController.createUser
        );

        this.router.patch(
            '/',
            passport.authenticate('jwt', { session: false }),
            this.userRequestValidator.updateUserValidator,
            this.userController.updateUser
        )

        this.router.delete(
            '/',
            passport.authenticate('jwt', { session: false }),
            this.userController.deleteUser
        );
    };

    public getRoutes() {
        return this.router;
    }
}