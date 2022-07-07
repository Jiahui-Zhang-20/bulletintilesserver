import mongoose, { Schema } from 'mongoose';

const PostSchema = new Schema({
  title: String,
  author: { type: Schema.Types.ObjectId, ref: 'User' },
  tags: String,
  coverUrl: String,
  content: String,
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
});

const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;
