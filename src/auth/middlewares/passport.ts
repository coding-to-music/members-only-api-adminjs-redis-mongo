import {
    ExtractJwt,
    Strategy as JwtStrategy,
    StrategyOptions
} from "passport-jwt";
import { PassportStatic } from "passport";
import { Request } from "express";
import { Types } from "mongoose";
import { ENV } from "@utils/loadEnv";
import { User } from "@user/models/user.model";

// Convert base64 .pem public key
const PUBLIC_KEY = Buffer.from(ENV.ACCESS_TOKEN_PUBLIC_KEY_BASE64, 'base64').toString('ascii');

const cookieExtractor = (req: Request) => {
    let token = null;
    if (req && req.signedCookies) {
        token = req.signedCookies['access_token'];
    }
    return token;
};

const jwtStrategyOptions: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUBLIC_KEY
};

export const initializePassport = (passport: PassportStatic) => {
    passport.use(new JwtStrategy(jwtStrategyOptions, async (jwt_payload, done) => {
        try {

            const id = new Types.ObjectId(jwt_payload.sub);

            const userExists = await User.findById(id).exec();

            return userExists ? done(null, userExists) : done(null, false);

        } catch (error) {
            done(error, false)
        }
    }));
};