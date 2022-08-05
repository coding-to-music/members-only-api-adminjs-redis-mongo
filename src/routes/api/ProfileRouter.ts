import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { getUserProfile, postCreateProfile } from '@controllers/profileController';

const profileRouter: CustomIRouter = Router();

profileRouter.get('/user-profile', passport.authenticate('jwt', { session: false }), getUserProfile);

profileRouter.post('/create-profile', passport.authenticate('jwt', { session: false }), postCreateProfile);

export default profileRouter;