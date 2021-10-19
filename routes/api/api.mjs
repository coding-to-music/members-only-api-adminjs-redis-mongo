import express from 'express';
import * as auth from '../../controllers/authController.mjs';
import * as user from '../../controllers/userController.mjs';
import * as profile from '../../controllers/profileController.mjs';
import passport from 'passport';

const router = express.Router()

router.get('/', (req, res) => { res.json({ msg: 'Not yet implemented!!!' }) });

// Authentication Routes
<<<<<<< HEAD
router.post('/auth', auth.post_loginUser);

router.get('/logout', auth.get_logoutUser);

router.post('/token_renewal', auth.post_refreshToken);

// User Routes
router.post('/register', user.post_createUser);

router.get('/user', passport.authenticate('jwt', { session: false }), user.get_getUser);

=======
router.post('/auth/login', auth.post_loginUser);

router.get('/auth/logout', auth.get_logoutUser);

router.post('/auth/renew_token', auth.post_refreshToken);

// User Routes
router.post('/user/register', user.post_createUser);

router.get('/user', passport.authenticate('jwt', { session: false }), user.get_getUser);

>>>>>>> ff6a1666365bcc879a57fb07a3744d2ada9b7492
// Profile Routes
router.get('/profile', passport.authenticate('jwt', { session: false }), profile.get_userProfile);

export default router