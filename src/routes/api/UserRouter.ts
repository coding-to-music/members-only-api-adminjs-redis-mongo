import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import {
    deleteUser,
    getAllUsers,
    getCurrentUser,
    postCreateUser,
} from '@controllers/userController';
import { authorizeUser } from '@middlewares/middleware';

const userRouter: CustomIRouter = Router();

userRouter.get('/all-users', passport.authenticate('jwt', { session: false }), authorizeUser, getAllUsers);

userRouter.get('/userinfo', passport.authenticate('jwt', { session: false }), getCurrentUser);

userRouter.post('/register', postCreateUser);

userRouter.delete('/delete-user', passport.authenticate('jwt', { session: false }), deleteUser);

export default userRouter;