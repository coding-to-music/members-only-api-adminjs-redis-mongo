import User from '@models/User';
import { body, validationResult } from 'express-validator';
import { sendMail } from '@utils/sendMail';
import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from '@interfaces/users.interface';

export const post_verification_code = [
    body('email').notEmpty().isEmail(),

    async (req: Request, res: Response, next: NextFunction) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const { email } = req.body;
            const user = await User.findOne({ email: email }).exec();
            if (!user) throw new Error(`User with email ${email} not found`);
            const code = await user.generateCode();
            const mailOptions: [string, string, string, string] = [
                email,
                'Verification code',
                `Your verification code is ${code}`,
                `<p>Please use this code: <strong style='color: red'>${code}</strong> to continue your password reset</p>`
            ];
            await sendMail(...mailOptions);
            res.json({ msg: "Verification Code sent!!!" });
        } catch (err) {
            console.error(err);
            return next(err)
        }
    }
]

export const put_reset_password = [

    body('email').notEmpty().isEmail(),
    body('new_password').notEmpty().isLength({ min: 6 }),
    body('verification_code').notEmpty().isLength({ min: 6 }).withMessage('must be at least 6 chars long'),

    async (req: Request, res: Response, next: NextFunction) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const { email, new_password, code } = req.body;
            const user = await User.findOne({ email: email }).exec();
            if (!user) throw new Error(`No user with email: ${email} found`);
            const { validCode, codeNotExpired } = await user.verifyCode(code);
            if (!validCode || !codeNotExpired) return res.status(403).json({ msg: 'Verification code is invalid or it has expired.' });
            user.password = new_password;
            await user.save();
            const { password, resetPassword, refreshToken, tokenVersion, ...data } = user._doc;
            res.json({ msg: 'password reset successful', data });
        } catch (err) {
            return next(err);
        }
    }
]

export const put_change_password = [
    body('old_password').notEmpty().isLength({ min: 6 }),
    body('new_password').notEmpty().isLength({ min: 6 }),

    async (req: RequestWithUser, res: Response, next: NextFunction) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const { old_password, new_password } = req.body;

            const user = await User.findById(req.user._id).exec();
            if (!user) throw new Error(`No user with id: ${req.user._id} found`);

            const validPassword = await user.validatePassword(old_password);
            if (!validPassword) return res.status(403).json({ msg: 'Old password is invalid' });

            user.password = new_password;
            await user.save();

            const { password, resetPassword, refreshToken, tokenVersion, ...data } = user._doc;
            res.json({ msg: 'password changed successful', data })
        } catch (error) {
            next(error);
        }
    }
]