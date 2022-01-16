import { IPost } from '@interfaces/posts.interface';
import { Schema, model } from 'mongoose';

const PostSchema = new Schema<IPost>({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  post_content: { type: String, required: true },
  date_posted: { type: Date, default: new Date(Date.now()) },
  comments: [
    {
      comment_user: { type: Schema.Types.ObjectId, ref: 'User' },
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
      like_user: { type: Schema.Types.ObjectId, ref: 'User' },
      date_liked: { type: Date, default: new Date(Date.now()) },
    }
  ]
});

export default model('Post', PostSchema);