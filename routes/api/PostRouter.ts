import { Router } from "express";
import { CustomIRouter } from "@interfaces/routes.interface";
import passport from "passport";
import * as PostController from "@controllers/postController";

const postRouter: CustomIRouter = Router();

postRouter.get('/all_posts', passport.authenticate('jwt', { session: false }), PostController.get_get_all_posts);

postRouter.get('/post_by_user', passport.authenticate('jwt', { session: false }), PostController.get_posts_by_user);

postRouter.post('/create_post', passport.authenticate('jwt', { session: false }), PostController.post_create_post);

postRouter.get('/:id', passport.authenticate('jwt', { session: false }), PostController.get_get_post_by_id);

postRouter.put('/:id/add_comment', passport.authenticate('jwt', { session: false }), PostController.put_add_comments);

postRouter.put('/:id/like_post', passport.authenticate('jwt', { session: false }), PostController.put_like_post);

postRouter.delete('/:id/delete_comment/:commentId', passport.authenticate('jwt', { session: false }), PostController.delete_delete_comment);

postRouter.delete('/:id/unlike_post', passport.authenticate('jwt', { session: false }), PostController.delete_unlike_post);

postRouter.delete('/:id/delete_post', passport.authenticate('jwt', { session: false }), PostController.delete_delete_post);

export default postRouter;