import User from '../models/User.mjs';
import { body, validationResult } from 'express-validator';
import { sendMail } from '../utils/sendMail.mjs';

export const get_verification_code = [
    body('email').notEmpty().isEmail(),

    async (req, res, next) => {
        const { email } = req.body;
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array())
        } else {

            try {
                const user = await User.findOne({ email: email }).exec();
                if (!user) throw new Error(`User with email ${email} not found`);
                const code = await user.generateCode();
                await sendMail(email, code);
                res.json({ msg: "Verification Code sent!!!" });
            } catch (err) {
                return next(err)
            }
        }
    }
]

export const put_reset_password = [

    body('email').notEmpty().isEmail(),
    body('code').notEmpty().isLength({ min: 6 }).withMessage('must be at least 6 chars long'),
    body('new_password').notEmpty().isLength({ min: 6 }),

    async (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        } else {
            try {
                const { email, new_password, code } = req.body;
                const user = await User.findOne({ email: email }).exec();
                if (!user) throw new Error(`No user with email: ${email} found`);
                const { validCode, codeNotExpired } = await user.verifyCode(code);
                if (!validCode || !codeNotExpired) return res.status(403).json({ msg: 'Verification code is invalid or it has expired.' });
                user.password = new_password;
                await user.save();
                const { password, resetPassword, refreshToken, ...data } = user._doc;
                res.json({ msg: 'password reset successful', data })
            } catch (err) {
                return next(err);
            }
        }
    }
]