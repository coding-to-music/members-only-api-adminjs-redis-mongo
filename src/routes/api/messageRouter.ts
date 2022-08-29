import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import messageController from '@controllers/messageController';

const messageRouter: CustomIRouter = Router();

messageRouter.get('/get-messages', passport.authenticate('jwt', { session: false }), messageController.getMessages);

messageRouter.post('/send-message', passport.authenticate('jwt', { session: false }), messageController.sendMessage)

export default messageRouter;