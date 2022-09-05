import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { authorizeUser } from '@middlewares/middleware';
import userController from '@src/controllers/user.controller';

const userRouter: CustomIRouter = Router();

userRouter.get('/all-users', passport.authenticate('jwt', { session: false }), authorizeUser, userController.getAllUsers);

userRouter.get('/userinfo', passport.authenticate('jwt', { session: false }), userController.getCurrentUser);

userRouter.post('/register', userController.postCreateUser);

userRouter.delete('/delete-user', passport.authenticate('jwt', { session: false }), userController.deleteUser);

export default userRouter;