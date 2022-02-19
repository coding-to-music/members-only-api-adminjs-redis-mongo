import { Router } from "express";
import { CustomIRouter } from "@interfaces/routes.interface";
import passport from "passport";
import { get_all_post_by_user, get_get_all_posts, get_get_post_by_id, post_create_post, put_add_comments, put_add_likes } from "@controllers/postController";


const postRouter: CustomIRouter = Router();

postRouter.get('/all_posts', passport.authenticate('jwt', { session: false }), get_get_all_posts);

postRouter.get('/:id', passport.authenticate('jwt', { session: false }), get_get_post_by_id);

postRouter.get('/post_by_user', passport.authenticate('jwt', { session: false }), get_all_post_by_user);

postRouter.post('/create_post', passport.authenticate('jwt', { session: false }), post_create_post);

postRouter.put('/:id/add_comment', passport.authenticate('jwt', { session: false }), put_add_comments);

postRouter.put('/:id/add_like', passport.authenticate('jwt', { session: false }), put_add_likes);

export default postRouter;