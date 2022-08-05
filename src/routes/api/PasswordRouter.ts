import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import {
    getVerificationCode,
    putChangePassword,
    putResetPassword,
} from '@controllers/passwordController';

const passwordRouter: CustomIRouter = Router();

passwordRouter.put('/get-verification-code', getVerificationCode);

passwordRouter.put('/reset-password', putResetPassword);

passwordRouter.put('/change-password', passport.authenticate('jwt', { session: false }), putChangePassword);

export default passwordRouter;