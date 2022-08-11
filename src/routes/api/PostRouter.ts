import { Router } from 'express';
import { authenticate } from 'passport';
import { CustomIRouter } from '@interfaces/routes.interface';
import postController from '@controllers/postController';

const postRouter: CustomIRouter = Router();

postRouter.get('/all-posts', authenticate('jwt', { session: false }), postController.getAllPosts);

postRouter.get('/post-by-user', authenticate('jwt', { session: false }), postController.getPostsByUser);

postRouter.get('/:id', authenticate('jwt', { session: false }), postController.getPostById);

postRouter.post('/create-post', authenticate('jwt', { session: false }), postController.postCreatePost);

postRouter.put('/:id/add-comment', authenticate('jwt', { session: false }), postController.putAddComments);

postRouter.put('/:id/like-post', authenticate('jwt', { session: false }), postController.putLikePost);

postRouter.delete('/:id/delete-comment/:commentId', authenticate('jwt', { session: false }), postController.deleteComment);

postRouter.delete('/:id/unlike-post', authenticate('jwt', { session: false }), postController.deleteUnlikePost);

postRouter.delete('/:id/delete-post', authenticate('jwt', { session: false }), postController.deletePost);

export default postRouter;