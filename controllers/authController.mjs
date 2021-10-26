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
                const validPassword = await bcrypt.compare(req.body.password, user.password)
                if (!validPassword) return res.status(400).json({ msg: 'Invalid email/password combination' });
                const payload = {
                    aud: "http://localhost",
                    iss: "http://localhost",
                    sub: user._id,
                    name: user.name,
                    email: user.email,
                    avatar: user.avatar,
                    isAdmin: user.isAdmin,
                    isMember: user.isMember,
                    last_login: user.lastLogin,
                };
                // Process Access token
                const ACCESS_TOKEN_PRIVATE_KEY = Buffer.from(process.env.ACCESS_TOKEN_PRIVATE_KEY_BASE64, 'base64').toString('ascii');
                const token = jwt.sign(payload, { key: ACCESS_TOKEN_PRIVATE_KEY, passphrase: process.env.ACCESS_TOKEN_SECRET }, { algorithm: 'RS256', expiresIn: '1h' });

                // Process Refresh token
                const REFRESH_TOKEN_PRIVATE_KEY = Buffer.from(process.env.REFRESH_TOKEN_PRIVATE_KEY_BASE64, 'base64').toString('ascii');
                const refresh_token = jwt.sign(payload, { key: REFRESH_TOKEN_PRIVATE_KEY, passphrase: process.env.REFRESH_TOKEN_SECRET }, { algorithm: 'RS256', expiresIn: '7d' });
                
                const { password, resetPassword, ...data } = user._doc;
                return res.cookie('access_token', token, { httpOnly: true, maxAge: 3600000, signed: true }).cookie('refresh_token', refresh_token, { httpOnly: true, maxAge: 604800000, signed: true }).json({ message: 'Login successful', user: data });

            } catch (err) {
                return next(err)
            }
        }
    }]

export const get_logout_user = (req, res) => {
    return res.clearCookie('access_token').json({ message: 'Logout successful' });
}

export const post_refresh_token = async (req, res, next) => {
    const { refresh_token } = req.signedCookies;
    if (!refresh_token) return res.status(404).json({ msg: 'Refresh Token not found' });
    try {
        // Verify refresh token in request
        const REFRESH_TOKEN_PUBLIC_KEY = Buffer.from(process.env.REFRESH_TOKEN_PUBLIC_KEY_BASE64, 'base64').toString('ascii');
        const decoded = jwt.verify(refresh_token, REFRESH_TOKEN_PUBLIC_KEY);

        // Check if user exists in DB
        const user = await User.findOne({ id: decoded.sub });
        if (!user) return res.status(404).json({ msg: 'User not found' });
        
        const { password, ...data } = user._doc;
        const { exp, ...rest } = decoded

        // Process new access token
        const ACCESS_TOKEN_PRIVATE_KEY = Buffer.from(process.env.ACCESS_TOKEN_PRIVATE_KEY_BASE64, 'base64').toString('ascii');
        jwt.sign(rest, { key: ACCESS_TOKEN_PRIVATE_KEY, passphrase: process.env.ACCESS_TOKEN_SECRET }, { algorithm: 'RS256', expiresIn: '1h' }, (err, token) => {
            if (err) return next(err)
            res.cookie('access_token', token, { httpOnly: true, maxAge: 3600000, signed: true }).json({ msg: 'Token refresh successful!!', user: data })
        });
    } catch (err) {
        return next(err);
    }
}
