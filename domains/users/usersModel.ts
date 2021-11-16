import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

import { User } from '../graphql/types';

mongoose.connect(process.env.MONGODB_URI || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export type TUserDocument = mongoose.Document &
  User & {
    validatePassword(password: string): boolean;
    toJSON(): object;
  };

export interface IUserModel extends mongoose.Model<TUserDocument> {
  hashPassword(password: string): string;
}

const userSchema = new mongoose.Schema<TUserDocument>({
  _id: { type: mongoose.Schema.Types.ObjectId },
  birthday: Date,
  email: { type: String, required: true },
  favoriteMovies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Movie' }],
  password: { type: String, required: true },
  username: { type: String, required: true },
});

userSchema.statics.hashPassword = (password: string) =>
  bcrypt.hashSync(password, 10);

userSchema.methods.validatePassword = async function validatePassword(
  password: string,
) {
  return bcrypt.compare(password, this.password);
};

export default mongoose.model<TUserDocument, IUserModel>('User', userSchema);
