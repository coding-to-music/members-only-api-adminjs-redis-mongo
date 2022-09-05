import { Router } from 'express';
import { CustomIRouter } from '@interfaces/routes.interface';
import authController from '@src/controllers/auth.controller';

const authRouter: CustomIRouter = Router();

authRouter.get('/logout', authController.getLogoutUser);

authRouter.post('/login', authController.postLoginUser);

authRouter.post('/refresh-token', authController.postRefreshToken);

export default authRouter;