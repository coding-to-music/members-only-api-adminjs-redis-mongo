import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { ProfileController } from '@src/controllers/profile.controller';


export class ProfileRouter {

    private profileController = new ProfileController();
    private router: CustomIRouter = Router();

    constructor() {
        this.registerRoutes()
    }

    private registerRoutes() {

        this.router.get('/user-profile', passport.authenticate('jwt', { session: false }), this.profileController.getUserProfile);
        this.router.post('/create-profile', passport.authenticate('jwt', { session: false }), this.profileController.postCreateProfile);
    }

    public getRoutes() {
        return this.router;
    }
}