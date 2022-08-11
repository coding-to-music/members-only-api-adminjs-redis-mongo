import { Router } from 'express';
import { authenticate } from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import messageController from '@controllers/messageController';

const messageRouter: CustomIRouter = Router();

messageRouter.get('/messages', authenticate('jwt', { session: false }), messageController.getMessages);

messageRouter.post('/send-message', authenticate('jwt', { session: false }), messageController.sendMessage)