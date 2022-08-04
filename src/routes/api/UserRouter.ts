import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { get_all_users, get_user, post_create_user, delete_delete_user } from '@controllers/userController';
import { authorizeUser } from '@middlewares/middleware';

const userRouter: CustomIRouter = Router();

userRouter.get('/all-users', passport.authenticate('jwt', { session: false }), authorizeUser, get_all_users);

userRouter.get('/userinfo', passport.authenticate('jwt', { session: false }), get_user);

userRouter.post('/register', post_create_user);

userRouter.delete('/delete-user', passport.authenticate('jwt', { session: false }), delete_delete_user);

export default userRouter;