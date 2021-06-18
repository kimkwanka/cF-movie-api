const express = require('express');
const usersController = require('./usersController');

const usersRouter = express.Router();

usersRouter.post('/users', usersController.addUser);
usersRouter.put('/users/:user_id', usersController.updateUser);
usersRouter.delete('/users/:user_id', usersController.deleteUser);
usersRouter.post('/users/:user_id/movies/:movie_id', usersController.addFavoriteMovieToUser);
usersRouter.delete('/users/:user_id/movies/:movie_id', usersController.removeFavoriteMovieFromUser);

module.exports = usersRouter;
