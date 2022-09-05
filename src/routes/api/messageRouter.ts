import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import messageController from '@controllers/messageController';

const messageRouter: CustomIRouter = Router();

messageRouter.get('/all', passport.authenticate('jwt', { session: false }), messageController.getMessages);

messageRouter.delete('/:id/delete', passport.authenticate('jwt', { session: false }), messageController.deleteMessage);

export default messageRouter;