import passport from 'passport';
import { BaseRouter } from '../base.router';
import { MessageController } from '@controllers/message.controller';
import { MessageRequestValidator } from '@middlewares/validations/message.validation';


export class MessageRouter extends BaseRouter {

    private messageController = new MessageController();
    private messageRequestValidator = new MessageRequestValidator()

    constructor() {
        super()
        
        this.registerRoutes()
    }

    protected registerRoutes() {

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

}