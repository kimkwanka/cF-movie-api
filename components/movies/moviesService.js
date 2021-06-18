/* eslint-disable max-len */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* eslint camelcase: ["error", { allow: ["user_id", "movie_id"]}] */
const mongoose = require('mongoose');
const { Movies } = require('../../models');

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

const findAllMovies = async () => Movies.find({});
const findMovieByTitle = async (movieTitleToFind) => Movies.findOne({ Title: movieTitleToFind });
const findMovieWithGenre = async (genreNameToFind) => Movies.findOne({ 'Genre.Name': genreNameToFind });
const findMovieWithDirector = async (directorNameToFind) => Movies.findOne({ 'Genre.Name': directorNameToFind });

module.exports = {
  findAllMovies,
  findMovieByTitle,
  findMovieWithGenre,
  findMovieWithDirector,
};
