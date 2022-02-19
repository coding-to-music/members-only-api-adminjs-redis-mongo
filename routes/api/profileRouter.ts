import { Router } from "express";
import { authenticate } from "passport";
import { CustomIRouter } from "@interfaces/routes.interface";
import { get_user_profile, post_create_profile } from "@/controllers/profileController";

const profileRouter: CustomIRouter = Router();

profileRouter.get('/user_profile', authenticate('jwt', { session: false }), get_user_profile);

profileRouter.post('/create_profile', authenticate('jwt', { session: false }), post_create_profile);

export default profileRouter;