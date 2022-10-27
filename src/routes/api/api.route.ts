import { Request, Response, Router } from 'express';
import { AuthRouter } from '@routes/api/auth.route';
import { MediaRouter } from '@routes/api/media.route';
import { MessageRouter } from '@routes/api/message.route';
import { PostRouter } from '@routes/api/post.route';
import { ProfileRouter } from '@routes/api/profile.route';
import { UserRouter } from '@routes/api/user.route';


export class ApiRouter {

    private router: Router;

    constructor() {
        this.router = Router()
        this.registerRoutes()
    }

    private registerRoutes() {

        this.router.get('/', (req: Request, res: Response) => res.json({
            message: `PLEASE VISIT '/api-docs' FOR FULL API DOCUMENTATION`
        }));
        this.router.use('/auth', new AuthRouter().getRoutes());
        this.router.use('/media', new MediaRouter().getRoutes());
        this.router.use('/messages', new MessageRouter().getRoutes());
        this.router.use('/posts', new PostRouter().getRoutes());
        this.router.use('/profile', new ProfileRouter().getRoutes());
        this.router.use('/users', new UserRouter().getRoutes());
    };

    public getRoutes() {
        return this.router;
    }
}