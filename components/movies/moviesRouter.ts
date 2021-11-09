import express from 'express';
import passport from 'passport';
import moviesController from './moviesController';

const moviesRouter = express.Router();

/**
 * Returns a list of all movies
 *
 * @name {GET} /movies
 * @path {GET} /movies
 * @auth This route requires JWT Authentication
 * @header Authorization: Bearer [token]
 * @code {200} OK
 * @code {401} Unauthorized
 * @response {Array.<Objects>} The list of all movies
 */
moviesRouter.get(
  '/movies',
  passport.authenticate('jwt', { session: false }),
  moviesController.getAllMovies,
);

/**
 * Returns data about a single movie by title
 *
 * @name {GET} /movie/:title
 * @path {GET} /movie/:title
 * @params {String} [title] The title of the movie
 * @auth This route requires JWT Authentication
 * @header Authorization: Bearer [token]
 * @code {200} OK
 * @code {401} Unauthorized
 * @code {404} Not found
 * @response {Object} - { "_id": "60c26e28a640a21b749adfeb", "title": "Joker", "genre": "Drama" "description": "In Gotham City, mentally troubled comedian Arthur Flec ...", "director": "Todd Phillips", "image_url": "http://images.samplewebsite.com/joker.png", "featured": false }
 */
moviesRouter.get(
  '/movies/:title',
  passport.authenticate('jwt', { session: false }),
  moviesController.getMovieByTitle,
);

/**
 * Returns data about a genre by name
 *
 * @name {GET} /genres/:name
 * @path {GET} /genres/:name
 * @params {String} [name] Genre name
 * @auth This route requires JWT Authentication
 * @header Authorization: Bearer [token]
 * @code {200} OK
 * @code {401} Unauthorized
 * @code {404} Not found
 * @response {Object} - { "name": "Thriller", "description": "Thriller is a genre of fiction, having numerous, often overlapping subgenres. Thrillers are characterized and defined by the moods they elicit, giving viewers heightened feelings of suspense, excitement, surprise, anticipation and anxiety. Successful examples of thrillers are the films of Alfred Hitchcock." }
 */
moviesRouter.get(
  '/genres/:name',
  passport.authenticate('jwt', { session: false }),
  moviesController.getGenreByName,
);

/**
 * Returns data about a director by name
 *
 * @name {GET} /directors/:name
 * @path {GET} /directors/:name
 * @params {String} [name] Name of the director
 * @auth This route requires JWT Authentication
 * @header Authorization: Bearer [token]
 * @code {200} OK
 * @code {401} Unauthorized
 * @code {404} Not found
 * @response {Object} - { "name": "Todd Phillips", "year_of_birth": 1970, "year_of_death": -1, "bio": "Todd Phillips was born on December 20, 1970 in Brooklyn, New York City, New York, USA as Todd Bunzl. He is a producer and director, known for Joker (2019), Old School (2003) and Due Date (2010)." }
 */
moviesRouter.get(
  '/directors/:name',
  passport.authenticate('jwt', { session: false }),
  moviesController.getDirectorByName,
);

export default moviesRouter;
