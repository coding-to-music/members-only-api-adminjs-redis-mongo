import { Router } from "express";
import passport from "passport";
import { CustomIRouter } from "@interfaces/routes.interface";
import { post_verification_code, put_reset_password, put_change_password } from "@controllers/passwordController";

const passwordRouter: CustomIRouter = Router();

passwordRouter.post('/verification_code', post_verification_code);

passwordRouter.put('/reset_password', put_reset_password);

passwordRouter.put('/change_password', passport.authenticate('jwt', { session: false }), put_change_password);

export default passwordRouter;