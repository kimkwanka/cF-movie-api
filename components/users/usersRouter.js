const express = require('express');
const passport = require('passport');
const usersController = require('./usersController');

const usersRouter = express.Router();

const allowRequestOnlyWithSameUserID = (req, res, next) => {
  const requestUserID = req.params.userId;
  // We need to cast to string or else equality check will never be true
  // (_id is an object for some reason, whereas userId is a regular string)
  const userID = req.user._id.toString();

  if (requestUserID !== userID) {
    return res.status(401).send('Unauthorized request');
  }

  return next();
};

/**
 * Register a new user
 *
 * @name {POST} /users
 * @path {POST} /users
 * @code {201} Created
 * @code {400} Bad request (username or email already exist)
 * @code {401} Unauthorized
 * @code {422} Unprocessable Entity (validation errors)
 * @code {500} Internal Server Error
 * @body {object} - { "username": "MangoChicken22", "password": "test123", "email":"mangochicken22@gmail.com", "birthday": "06/11/1973" }
 * @response {Object} - { "username": "MangoChicken22", "password": "test123", "email":"mangochicken22@gmail.com", "birthday": "06/11/1973" }
 */
usersRouter.post('/users', usersController.addUser);

/**
 * Update a user's data
 *
 * @name {PUT} /users/:userId
 * @path {PUT} /users/:userId
 * @params {String} [userId] User ID
 * @auth This route requires JWT Authentication
 * @header Authorization: {String} Bearer [token]
 * @code {200} OK
 * @code {400} Bad request (username or email already exist)
 * @code {401} Unauthorized
 * @code {404} Not found
 * @code {422} Unprocessable Entity (validation errors)
 * @body {object} - { "username": "MangoChicken22", "password": "test123", "email":"mangochicken22@gmail.com", "birthday": "06/11/1973" }
 * @response {Object} - { "username": "MangoChicken22", "password": "test123", "email":"mangochicken22@gmail.com", "birthday": "06/11/1973" }
 */
usersRouter.put('/users/:userId', passport.authenticate('jwt', { session: false }), allowRequestOnlyWithSameUserID, usersController.updateUser);

/**
 * Delete a user account
 *
 * @name {DELETE} /users/:userId
 * @path {DELETE} /users/:userId
 * @params {String} [userId] User ID
 * @auth This route requires JWT Authentication
 * @header Authorization: {String} Bearer [token]
 * @code {200} OK
 * @code {401} Unauthorized
 * @code {404} Not found
 * @response {String} - Text message indicating whether the user was successfully removed or not
 */
usersRouter.delete('/users/:userId', passport.authenticate('jwt', { session: false }), allowRequestOnlyWithSameUserID, usersController.deleteUser);

/**
 * Add a movie to a user's list of favorites
 *
 * @name {POST} /users/:userId/movies/:movieId
 * @path {POST} /users/:userId/movies/:movieId
 * @params {String} [userId] User ID
 * @params {String} [movieId] Movie ID
 * @auth This route requires JWT Authentication
 * @header Authorization: {String} Bearer [token]
 * @code {200} OK
 * @code {400} Bad request (movie is already a favorite)
 * @code {401} Unauthorized
 * @code {404} Not found
 * @response {String} - Text message indicating whether the movie was successfully added or not
 */
usersRouter.post('/users/:userId/movies/:movieId', passport.authenticate('jwt', { session: false }), allowRequestOnlyWithSameUserID, usersController.addFavoriteMovieToUser);

/**
 * Remove a movie from a user's list of favorites
 *
 * @name {DELETE} /users/:userId/movies/:movieId
 * @path {DELETE} /users/:userId/movies/:movieId
 * @params {String} [userId] User ID
 * @params {String} [movieId] Movie ID
 * @auth This route requires JWT Authentication
 * @header Authorization: {String} Bearer [token]
 * @code {200} OK
 * @code {400} Bad request (movie is not a favorite)
 * @code {401} Unauthorized
 * @code {404} Not found
 * @response {String} - Text message indicating whether the movie was successfully removed or not
 */
usersRouter.delete('/users/:userId/movies/:movieId', passport.authenticate('jwt', { session: false }), allowRequestOnlyWithSameUserID, usersController.removeFavoriteMovieFromUser);

module.exports = usersRouter;
