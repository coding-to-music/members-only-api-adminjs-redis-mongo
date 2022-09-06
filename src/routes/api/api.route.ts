import { Request, Response, Router } from 'express';
import { AuthRouter } from '@routes/api/auth.route';
import { MediaRouter } from '@routes/api/media.route';
import { MessageRouter } from '@routes/api/message.route';
import { PasswordRouter } from '@routes/api/password.route';
import { PostRouter } from '@routes/api/post.route';
import { ProfileRouter } from '@routes/api/profile.route';
import { UserRouter } from '@routes/api/user.route';


export class ApiRouter {

    private router: Router = Router();

    constructor() {
        this.registerRoutes()
    }

    private registerRoutes() {

        this.router.get('/', (req: Request, res: Response) => res.json({
            message: `HELLO VISITOR, THANK YOU FOR STOPPING-BY AND WELCOME TO MEMBERS-ONLY API.
            PLEASE VISIT '/api-docs' FOR FULL API DOCUMENTATION`
        }));
        this.router.use('/auth', new AuthRouter().getRoutes());
        this.router.use('/media', new MediaRouter().getRoutes());
        this.router.use('/messages', new MessageRouter().getRoutes());
        this.router.use('/password', new PasswordRouter().getRoutes());
        this.router.use('/posts', new PostRouter().getRoutes());
        this.router.use('/profile', new ProfileRouter().getRoutes());
        this.router.use('/users', new UserRouter().getRoutes());
    };

    public getRoutes() {
        return this.router;
    }
}