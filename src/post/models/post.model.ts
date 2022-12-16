import { Schema, model } from "mongoose";
import { IPost } from "../interfaces/posts.interface";

const PostSchema = new Schema<IPost>({
  user: { type: 'ObjectId', ref: 'User' },
  postTitle: { type: String, required: true },
  postContent: { type: String, required: true },
  datePosted: { type: Date, default: new Date(Date.now()) },
  comments: [
    {
      commentUser: { type: 'ObjectId', ref: 'User' },
      commentList: [
        {
          comment: { type: String },
          commentDate: { type: Date, default: new Date(Date.now()) },
        }
      ],
    }
  ],
  likes: [
    {
      byUser: { type: 'ObjectId', ref: 'User' },
      dateLiked: { type: Date, default: new Date(Date.now()) },
    }
  ]
}, { timestamps: true });

export const Post = model<IPost>('Post', PostSchema);