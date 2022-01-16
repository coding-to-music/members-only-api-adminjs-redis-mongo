import express from 'express';
import { authorize_user, get_logout_user, post_login_user, post_refresh_token, } from '@controllers/authController';
import { get_get_user, post_create_user } from '@controllers/userController';
import { get_verification_code, put_reset_password } from '@controllers/passwordController'
import * as profile from '@controllers/profileController';
import passport from 'passport';
import { CustomIRouter } from '@/interfaces/routes.interface';
import { post_create_post, put_add_comments, put_add_likes } from '@/controllers/postController';

const router: CustomIRouter = express.Router()

router.get('/', (req, res) => { res.json({ msg: 'Not yet implemented!!!' }) });

// Authentication Routes

router.get('/auth/logout', get_logout_user);

router.post('/auth/login', post_login_user);

router.post('/auth/refresh_token', post_refresh_token);

// User Routes

router.get('/user/userinfo', passport.authenticate('jwt', { session: false }), authorize_user, get_get_user);

router.post('/user/register', post_create_user);

// Password reset routes

router.get('/user/verification_code', get_verification_code);

router.put('/user/reset_password', put_reset_password);

// Profile Routes

router.get('/profile', passport.authenticate('jwt', { session: false }), profile.get_userProfile);

// Post Routes

router.post('/posts/create_post', passport.authenticate('jwt', { session: false }), post_create_post);

router.put('/posts/:id/add_comment', passport.authenticate('jwt', { session: false }), put_add_comments);

router.put('/posts/:id/add_like', passport.authenticate('jwt', { session: false }), put_add_likes);

export default router