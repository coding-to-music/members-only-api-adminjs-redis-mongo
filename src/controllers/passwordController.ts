import User from '@models/User';
import { body, validationResult } from 'express-validator';
import { sendMail } from '@utils/sendMail';
import { Request, Response, NextFunction } from 'express';
import { RequestWithUser } from '@interfaces/users.interface';
import {
    ForbiddenException,
    NotFoundException,
    ValidationBodyException,
} from '@exceptions/commonExceptions';

export const getVerificationCode = [
    body('email').notEmpty().isEmail(),

    async (req: Request, res: Response, next: NextFunction) => {

        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) throw new ValidationBodyException(errors.array());

            const { email } = req.body;

            const user = await User.findOne({ email: email }).exec();
            if (!user) throw new NotFoundException(`User with email ${email} not found`);

            const code = await user.generateCode();
            const mailOptions: [string, string, string, string] = [
                email,
                'Verification code',
                `Your verification code is ${code}`,
                `<p>Please use this code: <strong style='color: red'>${code}</strong> to continue your password reset</p>`
            ];

            await sendMail(...mailOptions);

            res.json({
                status: 'success',
                message: "Verification Code sent!!!"
            });

        } catch (err) {
            next(err)
        }
    }
]

export const putResetPassword = [

    body('email').notEmpty().isEmail(),
    body('new_password').notEmpty().isLength({ min: 6 }),
    body('verification_code').notEmpty().isLength({ min: 6 }).withMessage('must be at least 6 chars long'),

    async (req: Request, res: Response, next: NextFunction) => {

        try {

            const errors = validationResult(req);
            if (!errors.isEmpty()) throw new ValidationBodyException(errors.array());

            const { email, new_password, code } = req.body;
            const user = await User.findOne({ email }).exec();
            if (!user) throw new NotFoundException(`No user with email: ${email} found`);

            const { validCode, codeNotExpired } = await user.verifyCode(code);
            if (!validCode || !codeNotExpired) throw new ForbiddenException('Verification code is invalid or it has expired');

            user.password = new_password;
            await user.save();

            const { password, resetPassword, refreshToken, tokenVersion, ...data } = user._doc;

            res.json({
                status: 'success',
                message: 'password reset successful',
                data
            });

        } catch (err) {
            return next(err);
        }
    }
]

export const putChangePassword = [
    body('old_password').notEmpty().isLength({ min: 6 }),
    body('new_password').notEmpty().isLength({ min: 6 }),

    async (req: RequestWithUser, res: Response, next: NextFunction) => {

        try {
            
            const errors = validationResult(req);
            if (!errors.isEmpty()) throw new ValidationBodyException(errors.array());

            const { old_password, new_password } = req.body;

            const user = await User.findById(req.user._id).exec();
            if (!user) throw new NotFoundException(`No user with id: ${req.user._id} found`);

            const validPassword = await user.validatePassword(old_password);
            if (!validPassword) throw new ForbiddenException('Old password is invalid');

            user.password = new_password;
            await user.save();

            const { password, resetPassword, refreshToken, tokenVersion, ...data } = user._doc;
            res.json({
                status: 'success',
                message: 'password changed successful', data
            })

        } catch (error) {
            next(error);
        }
    }
]