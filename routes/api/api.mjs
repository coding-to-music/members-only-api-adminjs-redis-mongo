import express from 'express';
import { authorizeJWT, authorize_user, get_logout_user, post_login_user, post_refresh_token,  } from '../../controllers/authController.mjs';
import { get_get_user, post_create_user } from '../../controllers/userController.mjs';
import { get_verification_code, put_reset_password } from '../../controllers/passwordController.mjs'
import * as profile from '../../controllers/profileController.mjs';
import passport from 'passport';

const router = express.Router()

router.get('/', (req, res) => { res.json({ msg: 'Not yet implemented!!!' }) });

// Authentication Routes

router.get('/auth/logout', get_logout_user);

router.post('/auth/login', post_login_user);

router.post('/auth/token_renewal', post_refresh_token);

// User Routes

router.get('/user/userinfo', passport.authenticate('jwt', { session: false }), authorize_user, get_get_user);

router.post('/user/register', post_create_user);

// Password reset routes

router.get('/user/verify_code', get_verification_code);

router.put('/user/reset_password', put_reset_password);

// Profile Routes
router.get('/profile', passport.authenticate('jwt', { session: false }), profile.get_userProfile);

export default router