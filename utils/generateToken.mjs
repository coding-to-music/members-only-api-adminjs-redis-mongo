import { config } from 'dotenv';
import jwt from 'jsonwebtoken';

config();

export const generateToken = async (user) => {
    const payload = {
        aud: "http://localhost",
        iss: "http://localhost",
        sub: user?._id,
        name: user?.name,
        email: user?.email,
        avatar: user?.avatar,
        isAdmin: user?.isAdmin,
        isMember: user?.isMember,
        last_login: user?.lastLogin,
    };
    // Process Access token
    const ACCESS_TOKEN_PRIVATE_KEY = Buffer.from(process.env.ACCESS_TOKEN_PRIVATE_KEY_BASE64, 'base64').toString('ascii');
    const token = jwt.sign(payload, { key: ACCESS_TOKEN_PRIVATE_KEY, passphrase: process.env.ACCESS_TOKEN_SECRET }, { algorithm: 'RS256', expiresIn: '1h' });

    // Process Refresh token
    const REFRESH_TOKEN_PRIVATE_KEY = Buffer.from(process.env.REFRESH_TOKEN_PRIVATE_KEY_BASE64, 'base64').toString('ascii');
    const refresh_token = jwt.sign(payload, { key: REFRESH_TOKEN_PRIVATE_KEY, passphrase: process.env.REFRESH_TOKEN_SECRET }, { algorithm: 'RS256', expiresIn: '7d' });

    return { token, refresh_token };
}