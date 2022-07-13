import User from '@models/User';
import { body, validationResult } from 'express-validator';
import { JwtPayload, verify } from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { ENV } from '@utils/validateEnv';
import { Request, Response, NextFunction } from 'express';
import { sendTokens, cookieOptions } from '@utils/lib';

export const post_login_user = [

    body('email').notEmpty().isEmail().withMessage('Email is required and must be a valid email'),
    body('password').notEmpty().isLength({ min: 6 }).withMessage('Password is required and must be at least 6 characters long'),

    async (req: Request, res: Response, next: NextFunction) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        try {
            const user = await User.findOne({ email: req.body.email }).exec();
            if (!user) return res.status(404).json({ msg: 'User not found' });

            const validPassword: boolean = await bcrypt.compare(req.body.password, user.password);
            if (!validPassword) return res.status(401).json({ msg: 'Invalid email/password combination' });

            // Generate new Tokens and send them to the client
            const { token, refresh_token } = await user.generateTokens(user);
            sendTokens(res, refresh_token, 'Login Successful', token);
        } catch (err) {
            return next(err);
        }
    }
]

export const get_logout_user = (req: Request, res: Response) => {
    return res
        .clearCookie("jit", cookieOptions)
        .json({ message: "Logout successful" });
};

export const post_refresh_token = async (req: Request, res: Response, next: NextFunction) => {
    const { jit } = req.signedCookies;
    if (!jit) return res.status(404).json({ msg: 'Refresh Token not found' });
    try {
        // Verify refresh token in request
        const REFRESH_TOKEN_PUBLIC_KEY = Buffer.from(ENV.REFRESH_TOKEN_PUBLIC_KEY_BASE64, 'base64').toString('ascii');
        const decoded = verify(jit, REFRESH_TOKEN_PUBLIC_KEY) as JwtPayload;

        // Check if user exists in DB
        const user = await User.findOne({ id: decoded.sub });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Check if refresh token is valid
        const { validToken, refreshTokenNotExpired, tokenVersionValid } = await user.validateRefreshToken(jit);
        if (!validToken) return res.status(403).json({ msg: 'Invalid Refresh token' });
        if (!refreshTokenNotExpired) return res.status(403).json({ msg: 'Refresh token has expired, please initiate a new sign in request.' });
        if (!tokenVersionValid) return res.status(403).json({ msg: 'Token Invalid' });

        // Generate new Tokens and send them to the client
        const { token, refresh_token } = await user.generateTokens(user);
        sendTokens(res, refresh_token, 'Token Refresh Successful!!!', token);
    } catch (err) {
        return next(err);
    }
}