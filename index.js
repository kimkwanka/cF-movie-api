/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
const express = require('express');
const morgan = require('morgan');

const PORT = process.env.PORT || 8080;

const app = express();

// Sample API data
const top10Movies = [
  {
    title: 'Joker',
    director: 'Todd Phillips',
  },
  {
    title: 'Once Upon a Time... in Hollywood',
    director: 'Quentin Tarantino',
  },
  {
    title: 'Avengers: Endgame',
    director: 'Anthony Russo',
  },
  {
    title: 'Captain Marvel',
    director: 'Anna Boden',
  },
  {
    title: 'It Chapter Two',
    director: 'Andy Muschietti',
  },
  {
    title: 'The Lion King',
    director: 'Jon Favreau',
  },
  {
    title: 'Spider-Man: Far from Home',
    director: 'Jon Watts',
  },
  {
    title: 'Alita: Battle Angel',
    director: 'Robert Rodriguez',
  },
  {
    title: 'Aladdin',
    director: 'Guy Ritchie',
  },
  {
    title: 'Us',
    director: 'Jordan Peele',
  },
];

// Custom error handler middleware
const errorHandlerMiddleware = (err, req, res, _) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

const initMiddlewareAndRoutes = (expressApp) => {
  // Enable Logger
  expressApp.use(morgan('common'));

  // Send text response on '/'
  expressApp.get('/', (req, res) => {
    res.send('ROUTE: /');
  });

  // Send json response on '/movies'
  expressApp.get('/movies', (req, res) => {
    res.send(top10Movies);
  });

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
