import { Document, Types } from 'mongoose';

interface ILike {
    user: Types.ObjectId;
    date_liked: Date;
}

export interface ICommentEntry {
    comment: string;
    comment_date: Date
};

export interface IComment {
    comment_user: Types.ObjectId;
    comment_list: ICommentEntry[]
};

export interface IPost extends Document {
    user: Types.ObjectId;
    post_content: string;
    date_posted: Date;
    comments: IComment[];
    likes: ILike[];
};