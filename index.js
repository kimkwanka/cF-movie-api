/* eslint-disable max-len */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* eslint camelcase: ["error", { allow: ["user_id", "movie_id"]}] */

const express = require('express');
const morgan = require('morgan');

const auth = require('./components/auth/auth');

const moviesRouter = require('./components/movies/moviesRouter');
const usersRouter = require('./components/users/usersRouter');

const PORT = process.env.PORT || 8080;

const app = express();

// Custom error handler middleware
const errorHandlerMiddleware = (err, req, res, _) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

const initMiddlewareAndRoutes = (expressApp) => {
  // Remove the X-Powered-By headers
  expressApp.disable('x-powered-by');

  // Enable body-parser
  expressApp.use(express.json());

  // Enable Authentication
  expressApp.use(auth);

  // Enable Logger
  expressApp.use(morgan('common'));

  // Show documentation on root
  expressApp.get('/', (req, res) => {
    res.redirect('/documentation.html');
  });

  // API routes
  expressApp.use(moviesRouter);
  expressApp.use(usersRouter);

  // Serve static files
  expressApp.use(express.static('public'));

  // Handle errors
  expressApp.use(errorHandlerMiddleware);
};

initMiddlewareAndRoutes(app);

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`Express server running on port ${PORT}`);
});
