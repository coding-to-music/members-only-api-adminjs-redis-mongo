import { Router } from 'express';
import { authenticate } from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import profileController from '@controllers/profileController';

const profileRouter: CustomIRouter = Router();

profileRouter.get('/user-profile', authenticate('jwt', { session: false }), profileController.getUserProfile);

profileRouter.post('/create-profile', authenticate('jwt', { session: false }), profileController.postCreateProfile);

export default profileRouter;