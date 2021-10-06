import express from "express";
import * as user from "../../controllers/userController.mjs";
import passport from "passport";

const router = express.Router()

router.get('/', (req, res) => { res.json({ msg: 'Not yet implemented!!!' }) });

router.post('/register', user.post_createUser);

router.post('/login', user.post_loginUser);

router.get('/protected', passport.authenticate('jwt', { session: false }), user.get_getUser);

export default router