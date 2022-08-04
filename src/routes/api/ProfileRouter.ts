import { Router } from "express";
import passport from "passport";
import { CustomIRouter } from "@interfaces/routes.interface";
import { get_user_profile, post_create_profile } from "@controllers/profileController";

const profileRouter: CustomIRouter = Router();

profileRouter.get('/user-profile', passport.authenticate('jwt', { session: false }), get_user_profile);

profileRouter.post('/create-profile', passport.authenticate('jwt', { session: false }), post_create_profile);

export default profileRouter;