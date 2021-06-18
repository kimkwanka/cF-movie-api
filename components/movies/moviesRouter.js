const express = require('express');
const moviesController = require('./moviesController');

const moviesRouter = express.Router();

moviesRouter.get('/movies', moviesController.getAllMovies);
moviesRouter.get('/movies/:title', moviesController.getMovieByTitle);
moviesRouter.get('/genres/:name', moviesController.getGenreByName);
moviesRouter.get('/directors/:name', moviesController.getDirectorByName);

module.exports = moviesRouter;
