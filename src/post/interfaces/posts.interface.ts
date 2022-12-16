import { Document, Types } from "mongoose";

export interface ILike {
    _id?: Types.ObjectId;
    byUser: Types.ObjectId;
    dateLiked: Date;
}

export interface IUserComment {
    _id?: Types.ObjectId;
    commentText: string;
    commentDate: Date;
};

export interface IComment {
    _id?: Types.ObjectId;
    commentUser: Types.ObjectId;
    commentList: IUserComment[];
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
    commentUser: Types.ObjectId;
    commentList: IUserComment[];

    constructor(commentUser: Types.ObjectId, commentList: IUserComment[]) {
        this.commentUser = commentUser;
        this.commentList = commentList
    };
};

export class Like implements ILike {
    byUser: Types.ObjectId;
    dateLiked: Date;

    constructor(byUser: Types.ObjectId, dateLiked: Date) {
        this.byUser = byUser;
        this.dateLiked = dateLiked
    };
};