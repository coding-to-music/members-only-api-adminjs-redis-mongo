import User from "../models/User.mjs";
import { body, validationResult } from "express-validator";
import gravatar from "gravatar";

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
                            const { password, ...data } = theuser._doc;
                            res.json(data);
                        })
                    }
                })
        }
    }
];

export const get_getUser = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.user.email }).exec();
        if (!user) return res.status(404).json({ msg: 'User not found' });
        const { password, ...data } = user._doc;
        res.json(data);
    } catch (err) {
        return next(err);
    }
}