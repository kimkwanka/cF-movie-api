const Movies = require('./moviesModel');

const findAllMovies = async () => Movies.find({});

const findMovieByTitle = async (movieTitleToFind) => {
  const movieToFindByTitle = await Movies.findOne({ Title: new RegExp(`^${movieTitleToFind}$`, 'i') });

  if (!movieToFindByTitle) {
    return { statusCode: 404, body: `Couldn't find a movie with title: "${movieTitleToFind}"` };
  }
  return { statusCode: 200, body: movieToFindByTitle };
};

const findGenreByName = async (genreNameToFind) => {
  const movieWithGenre = await Movies.findOne({ 'genre.name': new RegExp(`^${genreNameToFind}$`, 'i') });

  if (!movieWithGenre) {
    return { statusCode: 404, body: `Couldn't find a genre with name: "${genreNameToFind}"` };
  }
  return { statusCode: 200, body: movieWithGenre.Genre };
};

const findDirectorByName = async (directorNameToFind) => {
  const movieWithDirector = await Movies.findOne({ 'director.name': new RegExp(`^${directorNameToFind}$`, 'i') });

  if (!movieWithDirector) {
    return { statusCode: 404, body: `Couldn't find a director with name: "${directorNameToFind}"` };
  }
  return { statusCode: 200, body: movieWithDirector.Director };
};

module.exports = {
  findAllMovies,
  findMovieByTitle,
  findGenreByName,
  findDirectorByName,
};
