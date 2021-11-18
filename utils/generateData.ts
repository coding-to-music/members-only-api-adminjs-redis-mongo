import { generateKeyPairSync, randomBytes } from 'crypto';
import { Buffer } from 'buffer';
import { ENV } from '@/utils/validateEnv';
import jwt from 'jsonwebtoken';
import { IUser } from '@interfaces/users.interface';
import { CookieOptions, Response } from 'express';

const genKeyPair = () => {
    const { publicKey, privateKey, } = generateKeyPairSync('rsa', {
        modulusLength: 4096,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem',
            cipher: 'aes-256-cbc',
            passphrase: ENV.REFRESH_TOKEN_SECRET
        }
    });

    const privateKey_base64 = Buffer.from(privateKey).toString('base64');
    const publicKey_base64 = Buffer.from(publicKey).toString('base64')

    console.log(privateKey_base64);
    console.log('================BEGIN PUBLIC KEY=====================');
    console.log(publicKey_base64);
}

// const KEY = fs.readFileSync(new URL('PATH-TO-KEY', import.meta.url)).toString('base64');
// console.log(KEY)

export const generateRandomCode = async (length: number) => {
    try {
        const code = await randomBytes(length).toString('hex').toUpperCase();
        return code;
    } catch (error) {
        console.error(error)
    }
}

export const tokenGenerator = async (user: IUser) => {
    const payload = {
        aud: "https://pollaroid.net",
        iss: "https://pollaroid.net",
        sub: user?._id,
        name: user?.name,
        email: user?.email,
        avatar: user?.avatar,
        isAdmin: user?.isAdmin,
        isMember: user?.isMember,
        last_login: user?.lastLogin,
    };
    // Process Access token
    const ACCESS_TOKEN_PRIVATE_KEY = Buffer.from(ENV.ACCESS_TOKEN_PRIVATE_KEY_BASE64, 'base64').toString('ascii');
    const token = jwt.sign(payload, { key: ACCESS_TOKEN_PRIVATE_KEY, passphrase: ENV.ACCESS_TOKEN_SECRET }, { algorithm: 'RS256', expiresIn: '15m' });

    // Process Refresh token
    const REFRESH_TOKEN_PRIVATE_KEY = Buffer.from(ENV.REFRESH_TOKEN_PRIVATE_KEY_BASE64, 'base64').toString('ascii');
    const refresh_token = jwt.sign(payload, { key: REFRESH_TOKEN_PRIVATE_KEY, passphrase: ENV.REFRESH_TOKEN_SECRET }, { algorithm: 'RS256', expiresIn: '7d' });

    return { token, refresh_token };
}

export const cookieOptions: CookieOptions = {
    domain: 'polldevs.com',
    path: '/api/auth/refresh_token',
    httpOnly: true,
    maxAge: 604800000,
    signed: true,
    sameSite: 'strict',
    secure: true,
}

export const sendTokens = (res: Response, refresh_token: string, msg_txt: string, token: string) => {
    return res
        .cookie('jit', refresh_token, cookieOptions)
        .json({ message: msg_txt, authToken: token });
}