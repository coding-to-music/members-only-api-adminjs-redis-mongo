import { Router } from "express";
import { authenticate } from "passport";
import { CustomIRouter } from "@interfaces/routes.interface";
import { get_get_user, post_create_user } from "@controllers/userController";
import { authorize_user } from "@controllers/authController";

const userRouter: CustomIRouter = Router();

userRouter.get('/userinfo', authenticate('jwt', { session: false }), authorize_user, get_get_user);

userRouter.post('/register', post_create_user);

export default userRouter;