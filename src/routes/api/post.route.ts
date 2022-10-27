import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { PostController } from '@controllers/post.controller';
import { PostRequestValidator } from '@middlewares/validations/post.validation';


export class PostRouter {

    private router: CustomIRouter;
    private postController: PostController;
    private postRequestValidator: PostRequestValidator

    constructor() {
        this.router = Router();
        this.postController = new PostController();
        this.postRequestValidator = new PostRequestValidator()
        this.registerRoutes()
    }

    private registerRoutes() {

        this.router.use(passport.authenticate('jwt', { session: false }));

        this.router.post(
            '/',
            this.postRequestValidator.createPostValidator,
            this.postController.createPost
        );
        
        this.router.get(
            '/user',
            this.postController.getPostsByUser
        );

        this.router.put(
            '/:id/comment',
            this.postRequestValidator.addCommentValidator,
            this.postController.addComments);

        this.router.put(
            '/:id/like',
            this.postRequestValidator.idValidator,
            this.postController.likePost
        );

        this.router.delete(
            '/:id/comment/:commentId',
            this.postRequestValidator.deleteCommentValidator,
            this.postController.deleteComment
        );

        this.router.delete(
            '/:id/unlike',
            this.postRequestValidator.idValidator,
            this.postController.unlikePost
        );

        this.router.delete(
            '/:id',
            this.postRequestValidator.idValidator,
            this.postController.deletePost
        );
    };

    public getRoutes() {
        return this.router;
    }
}