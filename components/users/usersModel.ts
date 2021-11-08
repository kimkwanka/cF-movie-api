import bcrypt from 'bcrypt';
import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

export interface IUserDocument extends mongoose.Document {
  _id: string;
  birthday: string;
  email: string;
  favoriteMovies: string[];
  password: string;
  username: string;
  validatePassword(password: string): boolean;
}

export interface IUserModel extends mongoose.Model<IUserDocument> {
  hashPassword(password: string): string;
}

const userSchema = new mongoose.Schema<IUserDocument>({
  _id: String,
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

export default mongoose.model<IUserDocument, IUserModel>('User', userSchema);
