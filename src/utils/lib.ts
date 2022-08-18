import { CookieOptions, Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';
import { ENV } from '@utils/validateEnv';
import Post from '@models/Post';
import { IPost } from '@interfaces/posts.interface';
import { sign } from 'jsonwebtoken';
import { IUser } from '@interfaces/users.interface';
import { ITokens } from '@interfaces/auth.interface';
import { NotFoundException } from '@exceptions/commonExceptions';
import { IUserOnlineData } from '@interfaces/message.interface';


export const generateRandomCode = async (length: number): Promise<string | null> => {
    try {
        const code = randomBytes(length).toString('hex').toUpperCase();
        return code;
    } catch (error) {
        console.error(error);
        return null;
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
    const token: string = sign(payload, { key: ACCESS_TOKEN_PRIVATE_KEY, passphrase: ENV.ACCESS_TOKEN_SECRET }, { algorithm: 'RS256', expiresIn: '1h' });

    // Process Refresh token
    const REFRESH_TOKEN_PRIVATE_KEY = Buffer.from(ENV.REFRESH_TOKEN_PRIVATE_KEY_BASE64, 'base64').toString('ascii');
    const refresh_token: string = sign(payload, { key: REFRESH_TOKEN_PRIVATE_KEY, passphrase: ENV.REFRESH_TOKEN_SECRET }, { algorithm: 'RS256', expiresIn: '7d' });

    return { token, refresh_token };
};

export const cookieOptions: CookieOptions = {
    path: '/v1/auth/refresh-token',
    httpOnly: true,
    maxAge: 604800000,
    signed: true,
    sameSite: 'none',
    secure: true,
};

export const sendTokens = (res: Response, refreshToken: string, statusText: string, accessToken: string) => {
    return res
        .cookie('jit', refreshToken, cookieOptions)
        .json({ message: statusText, authToken: accessToken });
};

export const formatPostCommentsAndLikes = (req: Request, res: Response, next: NextFunction): void => {
    switch (true) {
        case !req.body.comments:
            req.body.comments = []
            break;
        case !(req.body.comments instanceof Array):
            req.body.comments = new Array(req.body.comments);
            break;
        case !req.body.likes:
            req.body.likes = []
            break;
        case !(req.body.likes instanceof Array):
            req.body.likes = new Array(req.body.likes);
    }
    next();
};

export const formatProifleBody = (req: Request, res: Response, next: NextFunction): void => {
    switch (true) {
        case !req.body.education:
            req.body.education = []
            break;
        case !(req.body.education instanceof Array):
            req.body.education = new Array(req.body.education);
            break;
        case !req.body.experience:
            req.body.experience = []
            break;
        case !(req.body.experience instanceof Array):
            req.body.experience = new Array(req.body.experience);
            break;
        case !req.body.social:
            req.body.social = {};
            break;
        case !(req.body.social instanceof Object):
            req.body.social = { ...req.body.social };
            break;
        default:
            break;
    }
    next();
}

export const checkIfPostExists = async (req: Request, res: Response, next: NextFunction): Promise<IPost | void | Response> => {
    try {
        const document = await Post.findById(req.params.id).exec();
        if (!document) throw new NotFoundException('Post Not Found')
        return document;
    } catch (error) {
        return next(error);
    }
}

export const getDisconnectedUser = (map: Map<string, IUserOnlineData>, searchValue: string) => {
    return [...map.entries()].filter(([_key, value]) => value.clientID === searchValue)[0][0]
}