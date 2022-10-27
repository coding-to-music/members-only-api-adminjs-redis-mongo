import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { AdminController } from '@controllers/admin.controller';
import { AdminRequestValidator } from '@middlewares/validations/admin.validation';
import { Authorize } from '@middlewares/authorize';


export class AdminRouter {

    private router: CustomIRouter;
    private adminController: AdminController;
    private adminRequestValidator: AdminRequestValidator

    constructor() {
        this.router = Router();
        this.adminController = new AdminController();
        this.adminRequestValidator = new AdminRequestValidator()
        this.registerRoutes()
    }

    private registerRoutes() {

        this.router.use(
            passport.authenticate('jwt', { session: false }),
            Authorize.admin
        );

        this.router.get(
            '/posts',
            this.adminController.getAllPosts
        );

        this.router.get(
            '/posts/:id',
            this.adminRequestValidator.idValidator,
            this.adminController.getPostByID
        );

        this.router.get(
            '/profiles',
            this.adminController.getAllProfiles
        );

        this.router.get(
            '/profiles/:id',
            this.adminRequestValidator.idValidator,
            this.adminController.getProfileByID
        );

        this.router.get(
            '/users',
            this.adminController.getAllUsers
        );

        this.router.get(
            '/users/:id',
            this.adminRequestValidator.idValidator,
            this.adminController.getUserByID
        );

    };

    public getRoutes() {
        return this.router;
    }
}