/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* eslint camelcase: ["error", { allow: ["user_id", "movie_id"]}] */
const mongoose = require('mongoose');
const { Movies } = require('../../models');

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

const getAllMovies = async (req, res) => res.send(await Movies.find({}));

const getMovieByTitle = async (req, res) => {
  const movieTitleToFind = req.params.title;
  const movieToFindByTitle = await Movies.findOne({ Title: movieTitleToFind });

  if (movieToFindByTitle) {
    return res.send(movieToFindByTitle);
  }
  return res.status(404).send(`Couldn't find a movie with title: "${movieTitleToFind}"`);
};

const getGenreByName = async (req, res) => {
  const genreNameToFind = req.params.name;
  const movieWithGenre = await Movies.findOne({ 'Genre.Name': genreNameToFind });

  if (movieWithGenre) {
    return res.send(movieWithGenre.Genre);
  }
  return res.status(404).send(`Couldn't find a genre with name: "${genreNameToFind}"`);
};

const getDirectorByName = async (req, res) => {
  const directorNameToFind = req.params.name;
  const movieWithDirector = await Movies.findOne({ 'Director.Name': directorNameToFind });

  if (movieWithDirector) {
    return res.send(movieWithDirector.Director);
  }
  return res.status(404).send(`Couldn't find a director with name: "${directorNameToFind}"`);
};

module.exports = {
  getAllMovies,
  getMovieByTitle,
  getGenreByName,
  getDirectorByName,
};
