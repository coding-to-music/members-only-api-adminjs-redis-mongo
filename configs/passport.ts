import { ENV } from '@/utils/validateEnv';
import { Request } from 'express';
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from 'passport-jwt';
import mongoose from 'mongoose';
import User from '@models/User';

// Convert base64 .pem public key
const PUBLIC_KEY = Buffer.from(ENV.ACCESS_TOKEN_PUBLIC_KEY_BASE64, 'base64').toString('ascii');

const cookieExtractor = (req: Request) => {
    let token = null;
    if (req && req.signedCookies) {
        token = req.signedCookies['access_token'];
    }
    return token;
};

const opts: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUBLIC_KEY
};

export default (passport: { use: (arg0: JwtStrategy) => void; }) => {
    passport.use(new JwtStrategy(opts, (jwt_payload, done) => {
        const id = new mongoose.Types.ObjectId(jwt_payload.sub);
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