import { Router } from 'express';
import { CustomIRouter } from '@interfaces/routes.interface';
import {
    getLogoutUser,
    postLoginUser,
    postRefreshToken
} from '@controllers/authController';


const authRouter: CustomIRouter = Router();

authRouter.get('/logout', getLogoutUser);

authRouter.post('/login', postLoginUser);

authRouter.post('/refresh-token', postRefreshToken);

export default authRouter;