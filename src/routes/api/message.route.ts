import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { MessageController } from '@controllers/message.controller';


export class MessageRouter {

    private messageController = new MessageController();
    private router: CustomIRouter = Router();

    constructor() {
        this.registerRoutes()
    }

    private registerRoutes() {

        this.router.get('/all', passport.authenticate('jwt', { session: false }), this.messageController.getMessages);
        this.router.delete('/:id/delete', passport.authenticate('jwt', { session: false }), this.messageController.deleteMessage);
    }

    public getRoutes() {
        return this.router;
    }
}