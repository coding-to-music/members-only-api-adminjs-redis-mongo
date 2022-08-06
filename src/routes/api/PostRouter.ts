import { Router } from 'express';
import { CustomIRouter } from '@interfaces/routes.interface';
import passport from 'passport';
import postController from '@controllers/postController';

const postRouter: CustomIRouter = Router();

postRouter.get('/all-posts', passport.authenticate('jwt', { session: false }), postController.getAllPosts);

postRouter.get('/post-by-user', passport.authenticate('jwt', { session: false }), postController.getPostsByUser);

postRouter.get('/:id', passport.authenticate('jwt', { session: false }), postController.getPostById);

postRouter.post('/create-post', passport.authenticate('jwt', { session: false }), postController.postCreatePost);

postRouter.put('/:id/add-comment', passport.authenticate('jwt', { session: false }), postController.putAddComments);

postRouter.put('/:id/like-post', passport.authenticate('jwt', { session: false }), postController.putLikePost);

postRouter.delete('/:id/delete-comment/:commentId', passport.authenticate('jwt', { session: false }), postController.deleteComment);

postRouter.delete('/:id/unlike-post', passport.authenticate('jwt', { session: false }), postController.deleteUnlikePost);

postRouter.delete('/:id/delete-post', passport.authenticate('jwt', { session: false }), postController.deletePost);

export default postRouter;