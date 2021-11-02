import User from '../models/User.mjs';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';

config()

export const post_login_user = [

    body('email').notEmpty().isEmail(),
    body('password').notEmpty().isLength({ min: 6 }),

    async (req, res, next) => {

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json(errors.array());
        } else {
            try {
                const user = await User.findOne({ email: req.body.email }).exec();
                if (!user) return res.status(404).json({ msg: 'User not found' });
                const validPassword = await bcrypt.compare(req.body.password, user.password);
                if (!validPassword) return res.status(400).json({ msg: 'Invalid email/password combination' });

                // Use Cookies only
                // const { password, resetPassword, ...data } = user._doc;
                // return res.cookie('access_token', token, { httpOnly: true, maxAge: 3600000, signed: true, sameSite: 'none', secure: true }).cookie('refresh_token', refresh_token, { httpOnly: true, maxAge: 604800000, signed: true, sameSite: 'none', secure: true }).json({ message: 'Login successful', user: data });

                // Use JWT and cookies
                const { token, refresh_token } = await user.generateTokens(user);
                return res
                    .cookie('jit', refresh_token, {
                        domain: 'herokuapp.com',
                        httpOnly: true,
                        maxAge: 604800000,
                        signed: true,
                        sameSite: 'lax',
                        secure: true,
                    })
                    .json({ message: "Login successful", authToken: token });

            } catch (err) {
                return next(err)
            }
        }
    }]

export const get_logout_user = (req, res) => {
    return res.clearCookie('jit', { httpOnly: true, signed: true, sameSite: 'none', secure: true }).json({ message: 'Logout successful' });
}

export const post_refresh_token = async (req, res, next) => {
    const { jit } = req.signedCookies;
    if (!jit) return res.status(404).json({ msg: 'Refresh Token not found' });
    try {
        // Verify refresh token in request
        const REFRESH_TOKEN_PUBLIC_KEY = Buffer.from(process.env.REFRESH_TOKEN_PUBLIC_KEY_BASE64, 'base64').toString('ascii');
        const decoded = jwt.verify(jit, REFRESH_TOKEN_PUBLIC_KEY);

        // Check if user exists in DB
        const user = await User.findOne({ id: decoded.sub });
        if (!user) return res.status(404).json({ msg: 'User not found' });

        // Check if refresh token is valid
        const { validToken, refreshTokenNotExpired } = await user.validateRefreshToken(jit);
        if (!validToken) return res.status(403).json({ msg: 'Invalid Refresh token' });
        if (!refreshTokenNotExpired) return res.status(403).json({ msg: 'Refresh token has expired, please initiate a new sign in request.' });

        // Generate new tokens
        const { token, refresh_token } = await user.generateTokens(user);
        return res
            .cookie('jit', refresh_token, {
                domain: 'herokuapp.com',
                httpOnly: true,
                maxAge: 604800000,
                signed: true,
                sameSite: 'lax',
                secure: true,
            })
            .json({ message: "Token Refresh Successful!!!", authToken: token });
    } catch (err) {
        return next(err);
    }
}

export const authorizeJWT = (req, res, next) => {
    try {
        const authHeader = req.headers['authorization'];
        const token = (authHeader && authHeader.startsWith('Bearer')) && authHeader.split(' ')[1];
        if (!token) throw new Error('No token provided');
        const decoded = jwt.decode(token);
        if (!decoded.isAdmin) throw new Error('User not authorized to access this resource');
        next();
    } catch (err) {
        return res.status(403).json(err.message);
    }
}

export const authorize_user = (req, res, next) => {
    try {
        const { isAdmin } = req.user;
        if (!isAdmin) throw new Error('User not authorized to access this resource');
        next();
    } catch (err) {
        return res.status(403).json(err.message);
    }
}
