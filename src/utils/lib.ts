import { Request, Response, NextFunction } from "express";
import { IChatUserData } from "@message/interfaces/message.interface";
import { Post } from "@post/models/post.model";
import { IPost } from "@post/interfaces/posts.interface";
import { NotFoundException } from "@shared/exceptions/common.exception";

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

export const checkIfPostExists = async (id: string): Promise<IPost> => {

    const post = await Post.findById(id).exec();

    if (!post) throw new NotFoundException('Post Not Found')

    return post;
}

export const getDisconnectedUser = (map: Map<string, IChatUserData>, searchValue: string): string | false => {
    const foundKey = [...map.entries()].find(([_, value]) => value.clientID === searchValue);
    return foundKey ? foundKey[0] : false;
}