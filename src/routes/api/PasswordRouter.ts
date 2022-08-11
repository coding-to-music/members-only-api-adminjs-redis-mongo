import { Router } from 'express';
import { authenticate } from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import passwordController from '@controllers/passwordController';

const passwordRouter: CustomIRouter = Router();

passwordRouter.put('/get-verification-code', passwordController.getVerificationCode);

passwordRouter.put('/reset-password', passwordController.putResetPassword);

passwordRouter.put('/change-password', authenticate('jwt', { session: false }), passwordController.putChangePassword);

export default passwordRouter;