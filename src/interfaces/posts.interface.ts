import { Document, Types } from 'mongoose';

export interface ILike {
    like_user: Types.ObjectId;
    date_liked: Date;
}

export interface ICommentEntry {
    comment: string;
    comment_date: Date;
    _id?: Types.ObjectId;
};

export interface IComment {
    comment_user: Types.ObjectId;
    comment_list: ICommentEntry[];
};

export interface IPost extends Document {
    user: Types.ObjectId;
    postTitle: string;
    postContent: string;
    datePosted: Date;
    comments: IComment[];
    likes: ILike[];
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
};