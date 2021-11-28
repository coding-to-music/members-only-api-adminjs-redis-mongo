import mongoose, { Schema } from 'mongoose';

const PostSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  twit: { type: String, required: true },
  date_posted: { type: Date, default: Date.now },
  comments: [
    {
      by_user: { type: Schema.Types.ObjectId, ref: 'User' },
      comment: { type: String, min: 1 },
    }
  ],
  likes: [
    {
      by_user: { type: Schema.Types.ObjectId, ref: 'User' }
    }
  ]
});

export default mongoose.model('Post', PostSchema);