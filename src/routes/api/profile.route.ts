import passport from 'passport';
import { BaseRouter } from '../base.router';
import { ProfileController } from '@controllers/profile.controller';
import { ProfileRequestValidator } from '@middlewares/validations/profile.validation';


export class ProfileRouter extends BaseRouter {

    private profileController: ProfileController;
    private profileRequestValidator: ProfileRequestValidator

    constructor() {
        super();
        
        this.profileController = new ProfileController();
        this.profileRequestValidator = new ProfileRequestValidator();
        this.registerRoutes()
    }

    protected registerRoutes() {

        this.router.use(passport.authenticate('jwt', { session: false }));

        this.router.post(
            '/',
            this.profileRequestValidator.createProfileValidator,
            this.profileController.createProfile
        );

        this.router.get(
            '/user',
            this.profileController.getProfileByUser
        );

        this.router.patch(
            '/',
            this.profileRequestValidator.createProfileValidator,
            this.profileController.updateProfile
        );

        this.router.delete(
            '/',
            this.profileController.deleteProfile
        );
    }

}