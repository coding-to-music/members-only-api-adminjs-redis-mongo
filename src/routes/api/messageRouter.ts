import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import messageController from '@controllers/messageController';

const messageRouter: CustomIRouter = Router();

messageRouter.get('/get-messages', passport.authenticate('jwt', { session: false }), messageController.getMessages);

messageRouter.delete('/delete-message/:_id', passport.authenticate('jwt', { session: false }), messageController.deleteMessage)

export default messageRouter;