import { IPost } from '@interfaces/posts.interface';
import { Schema, model } from 'mongoose';

const PostSchema = new Schema<IPost>({
  user: { type: 'ObjectId', ref: 'User' },
  postTitle: { type: String, required: true },
  postContent: { type: String, required: true },
  datePosted: { type: Date, default: new Date(Date.now()) },
  comments: [
    {
      comment_user: { type: 'ObjectId', ref: 'User' },
      comment_list: [
        {
          comment: { type: String },
          comment_date: { type: Date, default: new Date(Date.now()) },
        }
      ],
    }
  ],
  likes: [
    {
      like_user: { type: 'ObjectId', ref: 'User' },
      date_liked: { type: Date, default: new Date(Date.now()) },
    }
  ]
}, { timestamps: true });

export default model<IPost>('Post', PostSchema);