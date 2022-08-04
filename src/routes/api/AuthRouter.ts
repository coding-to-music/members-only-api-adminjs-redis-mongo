import { Router } from 'express';
import { CustomIRouter } from '@interfaces/routes.interface';
import { get_logout_user, post_login_user, post_refresh_token } from '@controllers/authController';


const authRouter: CustomIRouter = Router();

authRouter.get('/logout', get_logout_user);

authRouter.post('/login', post_login_user);

authRouter.post('/refresh-token', post_refresh_token);

export default authRouter;