import mongoose from 'mongoose';

mongoose.connect(process.env.MONGODB_URI || '', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

interface IMovieDocument extends mongoose.Document {
  _id: string;
  title: string;
  description: string;
  genre: {
    name: string;
    description: string;
  };
  director: {
    name: string;
    bio: string;
    birth: string;
    death: string;
  };
  slug: string;
  featured: boolean;
  rating: number;
}

type TMovieModel = mongoose.Model<IMovieDocument>;

const movieSchema = new mongoose.Schema<IMovieDocument>({
  _id: { type: mongoose.Schema.Types.ObjectId },
  title: { type: String, required: true },
  description: { type: String, required: true },
  genre: {
    name: String,
    description: String,
  },
  director: {
    name: String,
    bio: String,
    birth: String,
    death: String,
  },
  slug: String,
  featured: Boolean,
  rating: Number,
});

export default mongoose.model<IMovieDocument, TMovieModel>(
  'Movie',
  movieSchema,
);
