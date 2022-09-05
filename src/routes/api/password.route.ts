import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import passwordController from '@src/controllers/password.controller';

const passwordRouter: CustomIRouter = Router();

passwordRouter.put('/get-verification-code', passwordController.getVerificationCode);

passwordRouter.put('/reset-password', passwordController.putResetPassword);

passwordRouter.put('/change-password', passport.authenticate('jwt', { session: false }), passwordController.putChangePassword);

export default passwordRouter;