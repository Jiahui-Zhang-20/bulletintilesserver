import mongoose, { Schema } from 'mongoose';

const bcrypt = require('bcryptjs');

const UserSchema = new Schema({
  authorName: { type: String },
  email: { type: String, unique: true, lowercase: true },
  password: { type: String },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
  timestamps: true,
});

UserSchema.pre('save', async function beforeyYourModelSave(next) {
  // this is a reference to our model
  // the function runs in some other context so DO NOT bind it
  const user = this;
  // only hash the passowrd if it has been modified (or is new)
  if (!user.isModified('password')) return next();
  try {
  // generate salt and hash modified/new password
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    // when done run the **next** callback with no arguments
    // call next with an error if you encounter one
    return next();
  } catch (error) {
    return next(error);
  }
});

// note use of named function rather than arrow notation, required here
UserSchema.methods.comparePassword = async function comparePassword(candidatePassword) {
  const comparison = await bcrypt.compare(candidatePassword, this.password);
  return comparison;
};

const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
