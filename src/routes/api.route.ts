import { BaseRouter } from "@shared/routers/base.router";
import { AdminRouter } from "@admin/admin.route";
import { AuthRouter } from "@auth/auth.route";
import { MediaRouter } from "@media/media.route";
import { MessageRouter } from "@message/message.route";
import { PostRouter } from "@post/post.route";
import { ProfileRouter } from "@profile/profile.route";
import { UserRouter } from "@user/user.route";

export class ApiRouter extends BaseRouter {

    constructor() {
        super()

        this.registerRoutes()
    }

    protected registerRoutes() {

        this.router.use('/admin', new AdminRouter().getRoutes());
        this.router.use('/auth', new AuthRouter().getRoutes());
        this.router.use('/media', new MediaRouter().getRoutes());
        this.router.use('/messages', new MessageRouter().getRoutes());
        this.router.use('/posts', new PostRouter().getRoutes());
        this.router.use('/profiles', new ProfileRouter().getRoutes());
        this.router.use('/users', new UserRouter().getRoutes());
    };

}