/* eslint-disable max-len */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* eslint camelcase: ["error", { allow: ["user_id", "movie_id"]}] */
const Movies = require('./moviesModel');

const findAllMovies = async () => Movies.find({});

const findMovieByTitle = async (movieTitleToFind) => {
  const movieToFindByTitle = await Movies.findOne({ Title: movieTitleToFind });

  if (movieToFindByTitle) {
    return { statusCode: 200, body: movieToFindByTitle };
  }
  return { statusCode: 404, body: `Couldn't find a movie with title: "${movieTitleToFind}"` };
};

const findGenreByName = async (genreNameToFind) => {
  const movieWithGenre = await Movies.findOne({ 'Genre.Name': genreNameToFind });

  if (movieWithGenre) {
    return { statusCode: 200, body: movieWithGenre.Genre };
  }
  return { statusCode: 404, body: `Couldn't find a genre with name: "${genreNameToFind}"` };
};

const findDirectorByName = async (directorNameToFind) => {
  const movieWithDirector = await Movies.findOne({ 'Director.Name': directorNameToFind });

  if (movieWithDirector) {
    return { statusCode: 200, body: movieWithDirector.Director };
  }
  return { statusCode: 404, body: `Couldn't find a director with name: "${directorNameToFind}"` };
};

module.exports = {
  findAllMovies,
  findMovieByTitle,
  findGenreByName,
  findDirectorByName,
};
