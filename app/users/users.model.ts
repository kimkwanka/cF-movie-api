import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { User } from '@generated/types';

mongoose.connect(process.env.MONGODB_URI || '');

export type TUserDocument = Omit<mongoose.Document, '_id'> &
  Omit<User, '_id'> & {
    _id: mongoose.Types.ObjectId;
    validatePassword(password: string): Promise<boolean>;
    toJSON(): object;
  };

export interface IUserModel extends mongoose.Model<TUserDocument> {
  hashPassword(password: string): Promise<string>;
}

const userSchema = new mongoose.Schema<TUserDocument>({
  _id: { type: mongoose.Schema.Types.ObjectId },
  birthday: Date,
  email: { type: String, required: true },
  favoriteMovies: [{ type: String }],
  passwordHash: { type: String, required: true },
  username: { type: String, required: true },
});

userSchema.statics.hashPassword = async (password: string) =>
  bcrypt.hash(password, 10);

userSchema.methods.validatePassword = async function validatePassword(
  password: string,
) {
  return bcrypt.compare(password, this.passwordHash);
};

export default mongoose.model<TUserDocument, IUserModel>('User', userSchema);
