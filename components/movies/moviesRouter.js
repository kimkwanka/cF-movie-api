const express = require('express');
const passport = require('passport');
const moviesController = require('./moviesController');

const moviesRouter = express.Router();

moviesRouter.get('/movies', passport.authenticate('jwt', { session: false }), moviesController.getAllMovies);
moviesRouter.get('/movies/:title', passport.authenticate('jwt', { session: false }), moviesController.getMovieByTitle);
moviesRouter.get('/genres/:name', passport.authenticate('jwt', { session: false }), moviesController.getGenreByName);
moviesRouter.get('/directors/:name', passport.authenticate('jwt', { session: false }), moviesController.getDirectorByName);

module.exports = moviesRouter;
