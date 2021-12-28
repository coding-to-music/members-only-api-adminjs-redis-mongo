import { CookieOptions, Request, Response, NextFunction } from 'express';
import { IComment, ICommentEntry } from '@interfaces/posts.interface';
import mongoose from 'mongoose';

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

export const formatPostComment = (req: Request, res: Response, next: NextFunction): void => {
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
    comment_user: mongoose.Types.ObjectId;
    comment_list: ICommentEntry[];

    constructor(commentUser: mongoose.Types.ObjectId, commentList: ICommentEntry[]) {
        this.comment_user = commentUser;
        this.comment_list = commentList
    };

    addComment(newComment: ICommentEntry): void {
        this.comment_list = [...this.comment_list, newComment]
    };
}