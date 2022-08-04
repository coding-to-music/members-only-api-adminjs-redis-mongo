import { Types } from 'mongoose';
import { IComment, ICommentEntry, ILike } from '@interfaces/posts.interface';

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
};