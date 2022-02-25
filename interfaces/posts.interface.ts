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
    post_content: string;
    date_posted: Date;
    comments: IComment[];
    likes: ILike[];
};