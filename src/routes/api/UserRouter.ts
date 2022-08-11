import { Router } from 'express';
import { authenticate } from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { authorizeUser } from '@middlewares/middleware';
import userController from '@controllers/userController';

const userRouter: CustomIRouter = Router();

userRouter.get('/all-users', authenticate('jwt', { session: false }), authorizeUser, userController.getAllUsers);

userRouter.get('/userinfo', authenticate('jwt', { session: false }), userController.getCurrentUser);

userRouter.post('/register', userController.postCreateUser);

userRouter.delete('/delete-user', authenticate('jwt', { session: false }), userController.deleteUser);

export default userRouter;