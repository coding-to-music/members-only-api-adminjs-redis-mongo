import User from '../models/User.mjs';
import { body, validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { config } from 'dotenv';
import { generateToken } from '../utils/generateToken.mjs';

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

                // Use Cookies only
                // const { password, resetPassword, ...data } = user._doc;
                // return res.cookie('access_token', token, { httpOnly: true, maxAge: 3600000, signed: true, sameSite: 'none', secure: true }).cookie('refresh_token', refresh_token, { httpOnly: true, maxAge: 604800000, signed: true, sameSite: 'none', secure: true }).json({ message: 'Login successful', user: data });
                
                // Use JWT and cookies
                const { token, refresh_token } = await generateToken(user);
                return res
                    .cookie('jit', refresh_token, {
                        httpOnly: true,
                        maxAge: 604800000,
                        signed: true,
                        sameSite: "none",
                        secure: true,
                    })
                    .json({ message: "Login successful", user: token });

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

        // Generate new tokens
        const { token, refresh_token } = await generateToken(user);
        return res
            .cookie('jit', refresh_token, {
                httpOnly: true,
                maxAge: 604800000,
                signed: true,
                sameSite: "none",
                secure: true,
            })
            .json({ message: "Token Refresh Successful!!!", user: token });
    } catch (err) {
        return next(err);
    }
}

export const authorize = (req, res, next) => {
    let token = null;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(" ")[1];
    }
    try {
        const decoded = jwt.decode(token);
        if (!decoded.isAdmin) throw new Error('User not authorized to access this resource');
        next();
    } catch (err) {
        return res.status(403).json(err.message);
    }
}


