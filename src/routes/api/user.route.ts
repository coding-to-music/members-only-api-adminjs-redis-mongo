import passport from 'passport';
import { BaseRouter } from '../base.router';
import { UserController } from '@controllers/user.controller';
import { UserRequestValidator } from '@middlewares/validations/user.validation';


export class UserRouter extends BaseRouter {

    private userController: UserController;
    private userRequestValidator: UserRequestValidator;

    constructor() {
        super();
        
        this.userController = new UserController();
        this.userRequestValidator = new UserRequestValidator();
        this.registerRoutes()
    }

    protected registerRoutes() {

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

}