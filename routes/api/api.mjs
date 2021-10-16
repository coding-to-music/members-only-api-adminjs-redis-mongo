import express from 'express';
import * as auth from '../../controllers/authController.mjs';
import * as user from '../../controllers/userController.mjs';
import * as profile from '../../controllers/profileController.mjs';
import passport from 'passport';

const router = express.Router()

router.get('/', (req, res) => { res.json({ msg: 'Not yet implemented!!!' }) });

// Authentication Routes
router.post('/auth', auth.post_loginUser);

router.get('/logout', auth.get_logoutUser);

router.post('/token_renewal', auth.post_refreshToken);

// User Routes
router.post('/register', user.post_createUser);

router.get('/user', passport.authenticate('jwt', { session: false }), user.get_getUser);

// Profile Routes
router.get('/profile', passport.authenticate('jwt', { session: false }), profile.get_userProfile);

export default router