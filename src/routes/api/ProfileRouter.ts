import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import profileController from '@controllers/profileController';

const profileRouter: CustomIRouter = Router();

profileRouter.get('/user-profile', passport.authenticate('jwt', { session: false }), profileController.getUserProfile);

profileRouter.post('/create-profile', passport.authenticate('jwt', { session: false }), profileController.postCreateProfile);

export default profileRouter;