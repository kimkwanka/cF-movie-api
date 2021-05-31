/* eslint-disable max-len */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');

const PORT = process.env.PORT || 8080;

const app = express();

// Sample API data
const genres = [
  {
    name: 'Thriller',
    description: `Thriller is a genre of fiction,
    having numerous, often overlapping subgenres. Thrillers are
    characterized and defined by the moods they elicit, giving viewers
    heightened feelings of suspense, excitement, surprise, anticipation
    and anxiety. Successful examples of thrillers are the films of Alfred
    Hitchcock.`,
  },
  {
    name: 'Comedy',
    description: `The comedy genre is made up of books about a series
    of funny or comical events or scenes that are intended to make the reader laugh.`,
  },
];

const movies = [
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

const directors = [
  {
    name: 'Todd Phillips',
    year_of_birth: 1970,
    year_of_death: -1,
    bio:
  `Todd Phillips was born on December 20, 1970 in Brooklyn, New York
  City, New York, USA as Todd Bunzl. He is a producer and director,
  known for Joker (2019), Old School (2003) and Due Date (2010).`,
  },
];

const users = [];

// Custom error handler middleware
const errorHandlerMiddleware = (err, req, res, _) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
};

const initMiddlewareAndRoutes = (expressApp) => {
  // Enable body-parser
  expressApp.use(express.json());

  // Enable Logger
  expressApp.use(morgan('common'));

  expressApp.get('/', (req, res) => {
    res.redirect('/documentation.html');
  });

  expressApp.get('/movies', (req, res) => {
    res.send(movies);
  });

  expressApp.get('/movies/:title', (req, res) => {
    const movieTitleToFind = req.params.title;
    const movieToFindByTitle = movies.find((movie) => (movie.title.toLowerCase() === movieTitleToFind.toLowerCase()));
    if (movieToFindByTitle) {
      res.send(movieToFindByTitle);
    } else {
      res.status(404).send(`Couldn't find a movie with title: "${movieTitleToFind}"`);
    }
  });

  expressApp.get('/genres/:name', (req, res) => {
    const genreNameToFind = req.params.name;
    const genreToFindByName = genres.find((genre) => (genre.name.toLowerCase() === genreNameToFind.toLowerCase()));
    if (genreToFindByName) {
      res.send(genreToFindByName);
    } else {
      res.status(404).send(`Couldn't find a genre with name: "${genreNameToFind}"`);
    }
  });

  expressApp.get('/directors/:name', (req, res) => {
    const directorNameToFind = req.params.name;
    const directorToFindByName = directors.find((genre) => (genre.name.toLowerCase() === directorNameToFind.toLowerCase()));
    if (directorToFindByName) {
      res.send(directorToFindByName);
    } else {
      res.status(404).send(`Couldn't find a director with name: "${directorNameToFind}"`);
    }
  });

  expressApp.post('/users', (req, res) => {
  });

  expressApp.patch('/users/:user_id', (req, res) => {
  });

  expressApp.delete('/users/:user_id', (req, res) => {
  });

  expressApp.post('/users/:user_id/movies/:movie_id', (req, res) => {
  });

  expressApp.delete('/users/:user_id/movies/:movie_id', (req, res) => {
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
