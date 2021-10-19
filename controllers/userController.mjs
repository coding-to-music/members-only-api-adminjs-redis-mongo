import User from '../models/User.mjs';
import { body, validationResult } from 'express-validator';
import gravatar from 'gravatar';

export const get_get_user = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.user.email }).exec();
        if (!user) return res.status(404).json({ msg: 'User not found' });
        const { password, resetPassword, ...data } = user._doc;
        res.json(data);
    } catch (err) {
        return next(err);
    }
}

export const post_create_user = [

    body('name', 'What is your name???').trim().isLength({ min: 1 }).escape(),
    body('email').notEmpty().isEmail(),
    body('password').notEmpty().isLength({ min: 6 }),

    (req, res, next) => {
        const { name, email, password, img } = req.body
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        } else {
            User.findOne({ email: email })
                .exec((err, found_user) => {
                    if (err) return next(err);
                    if (found_user) {
                        return res.status(409).json({ msg: 'User already exists' })
                    } else {
                        const avatar = gravatar.url(email, { s: '100', r: 'pg', d: 'retro' }, true);
                        const user = new User({
                            name: name,
                            email: email,
                            password: password,
                            avatar: avatar || img || ''
                        });
                        user.save((err, theuser) => {
                            if (err) return next(err);
                            const { password, resetPassword, ...data } = theuser._doc;
                            res.json(data);
                        })
                    }
                })
        }
    }
];

export const put_update_user = [
    async (req, res, next) => {
        res.send('Not yet implemented')
    }
]

export const delete_delete_user = async (req, res, next) => {
    res.send('Not yet implemented')
}