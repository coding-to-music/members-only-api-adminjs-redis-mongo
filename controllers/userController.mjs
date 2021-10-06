import User from "../models/User.mjs";
import { body, validationResult } from "express-validator";
import gravatar from "gravatar";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

dotenv.config()

export const post_createUser = [

    body('name', 'What is your name???').trim().isLength({ min: 1 }).escape(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),

    (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        } else {
            User.findOne({ email: req.body.email })
                .exec((err, found_user) => {
                    if (err) return next(err);
                    if (found_user) {
                        return res.status(409).json({ msg: 'User already exists' })
                    } else {
                        const avatar = gravatar.url(req.body.email, { s: '100', r: 'pg', d: 'retro' }, true);
                        const user = new User({
                            name: req.body.name,
                            email: req.body.email,
                            password: req.body.password
                        });
                        user.save((err, theuser) => {
                            if (err) return next(err);
                            res.json(theuser);
                        })
                    }
                })
        }
    }
];

export const post_loginUser = [

    body('email').isEmail(),
    body('password').isLength({ min: 6 }),

    async (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        } else {
            const user = await User.findOne({ email: req.body.email });
            if (!user) return res.status(404).json({ msg: 'User not found' });
            const validPassword = await bcrypt.compare(req.body.password, user.password)
            if (!validPassword) return res.status(400).json({ msg: 'Invalid email/password combination' });
            const payload = { aud: 'http://localhost', iss: 'http://localhost', sub: user._id, name: user.name, email: user.email, avatar: user.avatar, isAdmin: user.isAdmin, isMember: user.isMember };
            // Sign Token, first convert base64 .pem private key
            const PRIVATE_KEY = Buffer.from(process.env.PRIVATE_KEY_BASE64, 'base64').toString('ascii');
            jwt.sign(payload, { key: PRIVATE_KEY, passphrase: process.env.SECRET }, { algorithm: 'RS256', expiresIn: 3600 }, (err, token) => {
                if (err) return next(err);
                res.json({ success: true, token: 'Bearer ' + token });
            });
        }
    }]

export const get_getUser = (req, res, next) => {
    res.json({ msg: 'Success' })
}