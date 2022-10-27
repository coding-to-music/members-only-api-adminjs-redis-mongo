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

        this.router.get(
            '/user',
            this.postController.getPostsByUser
        );

        this.router.post(
            '/',
            this.postRequestValidator.createPostValidator,
            this.postController.createPost
        );

        this.router.put(
            '/:id/add-comment',
            this.postRequestValidator.addCommentValidator,
            this.postController.addComments);

        this.router.put(
            '/:id/like-post',
            this.postController.likePost
        );

        this.router.delete(
            '/:id/comment/:commentId',
            this.postController.deleteComment
        );

        this.router.delete(
            '/:id/unlike-post',
            this.postController.unlikePost
        );

        this.router.delete(
            '/:id',
            this.postController.deletePost
        );
    };

    public getRoutes() {
        return this.router;
    }
}