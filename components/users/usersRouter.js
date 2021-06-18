const express = require('express');
const passport = require('passport');
const usersController = require('./usersController');

const usersRouter = express.Router();

usersRouter.post('/users', usersController.addUser);
usersRouter.put('/users/:user_id', passport.authenticate('jwt', { session: false }), usersController.updateUser);
usersRouter.delete('/users/:user_id', passport.authenticate('jwt', { session: false }), usersController.deleteUser);
usersRouter.post('/users/:user_id/movies/:movie_id', passport.authenticate('jwt', { session: false }), usersController.addFavoriteMovieToUser);
usersRouter.delete('/users/:user_id/movies/:movie_id', passport.authenticate('jwt', { session: false }), usersController.removeFavoriteMovieFromUser);

module.exports = usersRouter;
