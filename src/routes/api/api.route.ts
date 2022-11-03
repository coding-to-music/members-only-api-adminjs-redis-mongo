import { Request, Response } from 'express';
import { BaseRouter } from '../base.router';
import { AdminRouter } from '@routes/api/admin.route';
import { AuthRouter } from '@routes/api/auth.route';
import { MediaRouter } from '@routes/api/media.route';
import { MessageRouter } from '@routes/api/message.route';
import { PostRouter } from '@routes/api/post.route';
import { ProfileRouter } from '@routes/api/profile.route';
import { UserRouter } from '@routes/api/user.route';


export class ApiRouter extends BaseRouter {

    constructor() {
        super()

        this.registerRoutes()
    }

    private index(req: Request, res: Response) {

        res.json({
            message: `PLEASE VISIT '/api-docs' FOR FULL API DOCUMENTATION`
        })

    }

    protected registerRoutes() {

        this.router.get('/', this.index);

        this.router.use('/admin', new AdminRouter().getRoutes());
        this.router.use('/auth', new AuthRouter().getRoutes());
        this.router.use('/media', new MediaRouter().getRoutes());
        this.router.use('/messages', new MessageRouter().getRoutes());
        this.router.use('/posts', new PostRouter().getRoutes());
        this.router.use('/profiles', new ProfileRouter().getRoutes());
        this.router.use('/users', new UserRouter().getRoutes());
    };

}