import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { MessageController } from '@controllers/message.controller';
import { MessageRequestValidator } from '@middlewares/validations/message.validation';


export class MessageRouter {

    private router: CustomIRouter = Router();
    private messageController = new MessageController();
    private messageRequestValidator = new MessageRequestValidator()

    constructor() {
        this.registerRoutes()
    }

    private registerRoutes() {

        this.router.use(passport.authenticate('jwt', { session: false }))

        this.router.get(
            '/user',
            this.messageController.getMessages
        );

        this.router.delete(
            '/:id',
            this.messageRequestValidator.idValidator,
            this.messageController.deleteMessage
        );
    }

    public getRoutes() {
        return this.router;
    }
}