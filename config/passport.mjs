import { config } from 'dotenv';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import mongoose from 'mongoose';
import User from '../models/User.mjs';

config();

// Convert base64 .pem public key
const PUBLIC_KEY = Buffer.from(process.env.ACCESS_TOKEN_PUBLIC_KEY_BASE64, 'base64').toString('ascii');

const cookieExtractor = (req) => {
    let token = null;
    if (req && req.signedCookies) {
        token = req.signedCookies['access_token'];
    }
    return token;
};

const opts = {};
opts.jwtFromRequest = cookieExtractor;
opts.secretOrKey = PUBLIC_KEY;

export default passport => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        const id = mongoose.Types.ObjectId(jwt_payload.sub);
        User.findById(id).exec((err, found_user) => {
            if (err) return done(err, null);
            if (found_user) {
                return done(null, found_user)
            } else {
                return done(null, false)
                // or create a new user
            };
        })
    }))
};