import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { ProfileController } from '@controllers/profile.controller';
import { ProfileRequestValidator } from '@middlewares/validations/profile.validation';


export class ProfileRouter {

    private router: CustomIRouter;
    private profileController: ProfileController;
    private profileRequestValidator: ProfileRequestValidator

    constructor() {
        this.router = Router();
        this.profileController = new ProfileController();
        this.profileRequestValidator = new ProfileRequestValidator();
        this.registerRoutes()
    }

    private registerRoutes() {

        this.router.use(passport.authenticate('jwt', { session: false }));
        
        this.router.get(
            '/user',
            this.profileController.getProfileByUser
        );

        this.router.post(
            '/',
            this.profileRequestValidator.createProfileValidator,
            this.profileController.createProfile
        );
    }

    public getRoutes() {
        return this.router;
    }
}