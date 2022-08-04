import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { put_verification_code, put_reset_password, put_change_password } from '@controllers/passwordController';

const passwordRouter: CustomIRouter = Router();

passwordRouter.put('/get-verification-code', put_verification_code);

passwordRouter.put('/reset-password', put_reset_password);

passwordRouter.put('/change-password', passport.authenticate('jwt', { session: false }), put_change_password);

export default passwordRouter;