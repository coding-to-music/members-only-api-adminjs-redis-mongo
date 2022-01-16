import { CookieOptions, Request, Response, NextFunction } from 'express';
import { IComment, ICommentEntry, ILike } from '@interfaces/posts.interface';
import { Types } from 'mongoose';
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

export class Comment implements IComment {
    comment_user: Types.ObjectId;
    comment_list: ICommentEntry[];

    constructor(commentUser: Types.ObjectId, commentList: ICommentEntry[]) {
        this.comment_user = commentUser;
        this.comment_list = commentList
    };
};

export class Like implements ILike {
    like_user: Types.ObjectId;
    date_liked: Date;

    constructor(likeUser: Types.ObjectId, dateLiked: Date) {
        this.like_user = likeUser;
        this.date_liked = dateLiked
    };
}

export const handleValidationErrors = (req: Request, res: Response) => {
    const errors = validationResult(req);
    return !errors.isEmpty() && res.status(422).json({ errors: errors.array() });
};