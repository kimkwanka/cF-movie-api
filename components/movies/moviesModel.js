const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });

const movieSchema = mongoose.Schema({
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

module.exports = mongoose.model('Movie', movieSchema);
