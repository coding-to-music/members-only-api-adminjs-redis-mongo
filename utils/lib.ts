import { CookieOptions, Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

export const cookieOptions: CookieOptions = {
    domain: 'polldevs.com',
    path: '/api/auth/refresh_token',
    httpOnly: true,
    maxAge: 604800000,
    signed: true,
    sameSite: 'strict',
    secure: true,
};

export const sendTokens = (res: Response, refresh_token: string, msg_txt: string, token: string) => {
    return res
        .cookie('jit', refresh_token, cookieOptions)
        .json({ message: msg_txt, authToken: token });
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

export const handleValidationErrors = (req: Request, res: Response) => {
    const errors = validationResult(req);
    return !errors.isEmpty() && res.status(422).json({ errors: errors.array() });
};