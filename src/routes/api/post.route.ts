import { Router } from 'express';
import passport from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import { PostController } from '@controllers/post.controller';


export class PostRouter {

    private postController = new PostController();
    private router: CustomIRouter = Router();

    constructor() {
        this.registerRoutes()
    }

    private registerRoutes() {

        this.router.get('/all-posts', passport.authenticate('jwt', { session: false }), this.postController.getAllPosts);
        this.router.get('/post-by-user', passport.authenticate('jwt', { session: false }), this.postController.getPostsByUser);
        this.router.get('/:id', passport.authenticate('jwt', { session: false }), this.postController.getPostById);
        this.router.post('/create-post', passport.authenticate('jwt', { session: false }), this.postController.postCreatePost);
        this.router.put('/:id/add-comment', passport.authenticate('jwt', { session: false }), this.postController.putAddComments);
        this.router.put('/:id/like-post', passport.authenticate('jwt', { session: false }), this.postController.putLikePost);
        this.router.delete('/:id/delete-comment/:commentId', passport.authenticate('jwt', { session: false }), this.postController.deleteComment);
        this.router.delete('/:id/unlike-post', passport.authenticate('jwt', { session: false }), this.postController.deleteUnlikePost);
        this.router.delete('/:id/delete-post', passport.authenticate('jwt', { session: false }), this.postController.deletePost);
    };

    public getRoutes() {
        return this.router;
    }
}