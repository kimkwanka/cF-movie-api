import express, { Request, Response, NextFunction } from 'express';

import authController from '@auth/authController';

import { getTokenPayload } from '@utils/jwt';

import usersController from './usersController';

const usersRouter = express.Router();

const allowRequestOnlyWithSameUserId = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestUserId = req.params.userId;
  // We need to cast to string or else equality check will never be true
  // (_id is an object for some reason, whereas userId is a regular string)

  const token = req?.headers?.authorization?.slice?.(7);

  if (!token) {
    return res.status(400).send({
      data: null,
      errors: {
        message: "Authentication Error: Access token couldn't be found.",
      },
    });
  }

  const { userId } = getTokenPayload(token);

  if (requestUserId !== userId) {
    return res.status(401).send({
      data: null,
      errors: {
        message: `Unauthorized: Not allowed to access user with id '${requestUserId}'`,
      },
    });
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
 * @params {String} [userId] User Id
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
usersRouter.put(
  '/users/:userId',
  authController.requireJWTAuth,
  allowRequestOnlyWithSameUserId,
  usersController.updateUser,
);

/**
 * Delete a user account
 *
 * @name {DELETE} /users/:userId
 * @path {DELETE} /users/:userId
 * @params {String} [userId] User Id
 * @auth This route requires JWT Authentication
 * @header Authorization: {String} Bearer [token]
 * @code {200} OK
 * @code {401} Unauthorized
 * @code {404} Not found
 * @response {String} - Text message indicating whether the user was successfully removed or not
 */
usersRouter.delete(
  '/users/:userId',
  authController.requireJWTAuth,
  allowRequestOnlyWithSameUserId,
  usersController.deleteUser,
);

/**
 * Add a movie to a user's list of favorites
 *
 * @name {POST} /users/:userId/movies/:movieId
 * @path {POST} /users/:userId/movies/:movieId
 * @params {String} [userId] User Id
 * @params {String} [movieId] Movie Id
 * @auth This route requires JWT Authentication
 * @header Authorization: {String} Bearer [token]
 * @code {200} OK
 * @code {400} Bad request (movie is already a favorite)
 * @code {401} Unauthorized
 * @code {404} Not found
 * @response {String} - Text message indicating whether the movie was successfully added or not
 */
usersRouter.post(
  '/users/:userId/movies/:movieId',
  authController.requireJWTAuth,
  allowRequestOnlyWithSameUserId,
  usersController.addFavoriteMovieToUser,
);

/**
 * Remove a movie from a user's list of favorites
 *
 * @name {DELETE} /users/:userId/movies/:movieId
 * @path {DELETE} /users/:userId/movies/:movieId
 * @params {String} [userId] User Id
 * @params {String} [movieId] Movie Id
 * @auth This route requires JWT Authentication
 * @header Authorization: {String} Bearer [token]
 * @code {200} OK
 * @code {400} Bad request (movie is not a favorite)
 * @code {401} Unauthorized
 * @code {404} Not found
 * @response {String} - Text message indicating whether the movie was successfully removed or not
 */
usersRouter.delete(
  '/users/:userId/movies/:movieId',
  authController.requireJWTAuth,
  allowRequestOnlyWithSameUserId,
  usersController.removeFavoriteMovieFromUser,
);

export default usersRouter;
