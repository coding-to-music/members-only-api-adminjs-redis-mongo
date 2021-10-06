import mongoose, { Schema } from "mongoose";

const PostSchema = new mongoose.Schema({
  user: { type: Schema.Types.ObjectId, ref: "User" },
  posts: [
    {
      post: { type: String, min: 1, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
});

export default mongoose.model('Post', PostSchema);