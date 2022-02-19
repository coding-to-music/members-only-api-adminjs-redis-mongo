import { Router } from "express";
import { CustomIRouter } from "@interfaces/routes.interface";
import { authenticate } from "passport";
import { get_all_post_by_user, get_get_all_posts, get_get_post_by_id, post_create_post, put_add_comments, put_add_likes } from "@controllers/postController";


const postRouter: CustomIRouter = Router();

postRouter.get('/all_posts', authenticate('jwt', { session: false }), get_get_all_posts);

postRouter.get('/:id', authenticate('jwt', { session: false }), get_get_post_by_id);

postRouter.get('/post_by_user', authenticate('jwt', { session: false }), get_all_post_by_user);

postRouter.post('/create_post', authenticate('jwt', { session: false }), post_create_post);

postRouter.put('/:id/add_comment', authenticate('jwt', { session: false }), put_add_comments);

postRouter.put('/:id/add_like', authenticate('jwt', { session: false }), put_add_likes);

export default postRouter;