import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import profileController from '@src/controllers/profile.controller';

const profileRouter: CustomIRouter = Router();

profileRouter.get('/user-profile', passport.authenticate('jwt', { session: false }), profileController.getUserProfile);

profileRouter.post('/create-profile', passport.authenticate('jwt', { session: false }), profileController.postCreateProfile);

export default profileRouter;