import { Router } from 'express';
import { CustomIRouter } from '@interfaces/routes.interface';
import passport from 'passport';
import {
    getAllPosts,
    getPostById,
    getPostsByUser,
    postCreatePost,
    putAddComments,
    putLikePost,
    deleteComment,
    deletePost,
    deleteUnlikePost
} from '@controllers/postController';

const postRouter: CustomIRouter = Router();

postRouter.get('/all-posts', passport.authenticate('jwt', { session: false }), getAllPosts);

postRouter.get('/post-by-user', passport.authenticate('jwt', { session: false }), getPostsByUser);

postRouter.get('/:id', passport.authenticate('jwt', { session: false }), getPostById);

postRouter.post('/create-post', passport.authenticate('jwt', { session: false }), postCreatePost);

postRouter.put('/:id/add-comment', passport.authenticate('jwt', { session: false }), putAddComments);

postRouter.put('/:id/like-post', passport.authenticate('jwt', { session: false }), putLikePost);

postRouter.delete('/:id/delete-comment/:commentId', passport.authenticate('jwt', { session: false }), deleteComment);

postRouter.delete('/:id/unlike-post', passport.authenticate('jwt', { session: false }), deleteUnlikePost);

postRouter.delete('/:id/delete-post', passport.authenticate('jwt', { session: false }), deletePost);

export default postRouter;