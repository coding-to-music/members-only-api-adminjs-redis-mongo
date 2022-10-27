import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { PostController } from '@controllers/post.controller';
import { PostRequestValidator } from '@src/middlewares/validations/post.validation';


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

        this.router.get('/', passport.authenticate('jwt', { session: false }), this.postController.getAllPosts);

        this.router.get('/user', passport.authenticate('jwt', { session: false }), this.postController.getPostsByUser);

        this.router.get('/:id', passport.authenticate('jwt', { session: false }), this.postController.getPostById);

        this.router.post(
            '/',
            passport.authenticate('jwt', { session: false }),
            this.postRequestValidator.createPostValidator,
            this.postController.createPost
        );

        this.router.put('/:id/add-comment', passport.authenticate('jwt', { session: false }), this.postController.putAddComments);

        this.router.put('/:id/like-post', passport.authenticate('jwt', { session: false }), this.postController.putLikePost);

        this.router.delete('/:id/comment/:commentId', passport.authenticate('jwt', { session: false }), this.postController.deleteComment);

        this.router.delete('/:id/unlike-post', passport.authenticate('jwt', { session: false }), this.postController.deleteUnlikePost);

        this.router.delete('/:id/delete-post', passport.authenticate('jwt', { session: false }), this.postController.deletePost);
    };

    public getRoutes() {
        return this.router;
    }
}