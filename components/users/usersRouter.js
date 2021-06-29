const express = require('express');
const passport = require('passport');
const usersController = require('./usersController');

const usersRouter = express.Router();

const allowRequestOnlyWithSameUserID = (req, res, next) => {
  const requestUserID = req.params.user_id;
  // We need to cast to string or else equality check will never be true
  // (_id is an object for some reason, whereas user_id is a regular string)
  const userID = req.user._id.toString();

  if (requestUserID !== userID) {
    return res.status(401).send('Unauthorized request');
  }

  return next();
};

usersRouter.post('/users', usersController.addUser);
usersRouter.put('/users/:user_id', passport.authenticate('jwt', { session: false }), allowRequestOnlyWithSameUserID, usersController.updateUser);
usersRouter.delete('/users/:user_id', passport.authenticate('jwt', { session: false }), allowRequestOnlyWithSameUserID, usersController.deleteUser);
usersRouter.post('/users/:user_id/movies/:movie_id', passport.authenticate('jwt', { session: false }), allowRequestOnlyWithSameUserID, usersController.addFavoriteMovieToUser);
usersRouter.delete('/users/:user_id/movies/:movie_id', passport.authenticate('jwt', { session: false }), allowRequestOnlyWithSameUserID, usersController.removeFavoriteMovieFromUser);

module.exports = usersRouter;
