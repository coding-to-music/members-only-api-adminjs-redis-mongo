import { sign } from 'jsonwebtoken';
import { randomBytes } from 'crypto';
import { ENV } from '@utils/validateEnv';
import { IUser } from '@interfaces/users.interface';
import { ITokens } from '@interfaces/auth.interface';
import { logger } from './logger';

type TextCase = 'upper' | 'lower';

export const generateRandomText = (length: number, textCase: TextCase) => {
    try {

        return textCase === 'upper'
            ? randomBytes(length).toString('hex').toUpperCase()
            : randomBytes(length).toString('hex')

    } catch (error: any) {
        logger.error(String(error))
    }
}

export const createLoginTokens = async (user: IUser): Promise<ITokens> => {
    const payload = {
        aud: "https://pollaroid.net",
        iss: "https://pollaroid.net",
        sub: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        roles: user.roles,
        lastLogin: user.lastLogin,
        tokenVersion: user.tokenVersion
    };

    // Process Access token
    const ACCESS_TOKEN_PRIVATE_KEY = Buffer.from(ENV.ACCESS_TOKEN_PRIVATE_KEY_BASE64, 'base64').toString('ascii');
    const accessToken: string = sign(
        payload,
        {
            key: ACCESS_TOKEN_PRIVATE_KEY,
            passphrase: ENV.ACCESS_TOKEN_SECRET
        },
        {
            algorithm: 'RS256',
            expiresIn: '1h'
        }
    );

    // Process Refresh token
    const REFRESH_TOKEN_PRIVATE_KEY = Buffer.from(ENV.REFRESH_TOKEN_PRIVATE_KEY_BASE64, 'base64').toString('ascii');
    const refreshToken: string = sign(
        payload,
        {
            key: REFRESH_TOKEN_PRIVATE_KEY,
            passphrase: ENV.REFRESH_TOKEN_SECRET
        },
        {
            algorithm: 'RS256',
            expiresIn: '7d'
        }
    );

    return { accessToken, refreshToken };
};