/* eslint-disable max-len */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
const express = require('express');
const morgan = require('morgan');
const uuid = require('uuid');

const mongoose = require('mongoose');
const Models = require('./models');

const Movies = Models.Movie;
const Users = Models.User;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

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
    id: '0',
    title: 'Joker',
    director: 'Todd Phillips',
    description: 'Sample Description',
    genre: 'drama',
    imgUrl: 'http://samplewebsite.com/movie.jpg',
  },
  {
    id: '1',
    title: 'Once Upon a Time... in Hollywood',
    director: 'Quentin Tarantino',
    description: 'Sample Description',
    genre: 'drama',
    imgUrl: 'http://samplewebsite.com/movie.jpg',
  },
  {
    id: '2',
    title: 'Avengers: Endgame',
    director: 'Anthony Russo',
    description: 'Sample Description',
    genre: 'drama',
    imgUrl: 'http://samplewebsite.com/movie.jpg',
  },
  {
    id: '3',
    title: 'Captain Marvel',
    director: 'Anna Boden',
    description: 'Sample Description',
    genre: 'drama',
    imgUrl: 'http://samplewebsite.com/movie.jpg',
  },
  {
    id: '4',
    title: 'It Chapter Two',
    director: 'Andy Muschietti',
    description: 'Sample Description',
    genre: 'drama',
    imgUrl: 'http://samplewebsite.com/movie.jpg',
  },
  {
    id: '5',
    title: 'The Lion King',
    director: 'Jon Favreau',
    description: 'Sample Description',
    genre: 'drama',
    imgUrl: 'http://samplewebsite.com/movie.jpg',
  },
  {
    id: '6',
    title: 'Spider-Man: Far from Home',
    director: 'Jon Watts',
    description: 'Sample Description',
    genre: 'drama',
    imgUrl: 'http://samplewebsite.com/movie.jpg',
  },
  {
    id: '7',
    title: 'Alita: Battle Angel',
    director: 'Robert Rodriguez',
    description: 'Sample Description',
    genre: 'drama',
    imgUrl: 'http://samplewebsite.com/movie.jpg',
  },
  {
    id: '8',
    title: 'Aladdin',
    director: 'Guy Ritchie',
    description: 'Sample Description',
    genre: 'drama',
    imgUrl: 'http://samplewebsite.com/movie.jpg',
  },
  {
    id: '9',
    title: 'Us',
    director: 'Jordan Peele',
    description: 'Sample Description',
    genre: 'drama',
    imgUrl: 'http://samplewebsite.com/movie.jpg',
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

const users = [
  {
    id: '194aa46a-7c4a-4124-8cb7-48259b2cceec',
    username: 'Nianmo',
    password: 'pwd123',
    email: 'nianmo@outlook.com',
    birthday: '04/01/1996',
    favoriteMovies: [],
  },
];

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

  expressApp.post('/users', async (req, res) => {
    const {
      Username, Password, Email, Birthday,
    } = req.body;

    try {
      const alreadyExistingUser = await Users.findOne({ Username });
      if (alreadyExistingUser) {
        return res.status(400).send(`${Username} already exists.`);
      }

      const newUser = await Users.create({
        Username, Password, Email, Birthday,
      });

      return res.status(201).json(newUser);
    } catch (error) {
      console.error(error);
      return res.status(500).send(`Error: ${error}`);
    }
  });

  expressApp.put('/users/:_id', async (req, res) => {
    const {
      Username, Password, Email, Birthday,
    } = req.body;

    const { _id } = req.params;

    try {
      const updatedUser = await Users.findOneAndUpdate({ _id }, {
        $set: {
          Username, Password, Email, Birthday,
        },
      }, {
        new: true,
      });
      return res.status(200).json(updatedUser);
    } catch (error) {
      console.error(error);
      return res.status(500).send(`Error: ${error}`);
    }
  });

  expressApp.delete('/users/:_id', async (req, res) => {
    const { _id } = req.params;

    try {
      const userToDelete = await Users.findOneAndRemove({ _id });
      if (!userToDelete) {
        return res.status(400).send(`User with ID ${_id} couldn't be found.`);
      }
      return res.status(200).send(`User with ID ${_id} was successfully removed.`);
    } catch (error) {
      console.error(error);
      return res.status(500).send(`Error: ${error}`);
    }
  });

  expressApp.post('/users/:user_id/movies/:movie_id', (req, res) => {
    const userIDToFind = req.params.user_id;
    const userToUpdate = users.find((user) => (user.id === userIDToFind));

    if (userToUpdate) {
      const movieIDToFind = req.params.movie_id;
      const movieIDAlreadyInFavorites = userToUpdate.favoriteMovies.includes(movieIDToFind);
      const movieWithIDExists = movies.findIndex((movie) => (movie.id === movieIDToFind)) !== -1;

      if (!movieIDAlreadyInFavorites && movieWithIDExists) {
        userToUpdate.favoriteMovies.push(movieIDToFind);
        res.status(200).send(`Successfully added movie with id: ${movieIDToFind} to favorites`);
      } else if (movieIDAlreadyInFavorites) {
        res.status(400).send(`Movie with id: ${movieIDToFind} is already a favorite.`);
      } else {
        res.status(400).send(`Movie with id: ${movieIDToFind} doesn't exist.`);
      }
    } else {
      res.status(404).send(`Couldn't find a user with id: "${userIDToFind}"`);
    }
  });

  expressApp.delete('/users/:user_id/movies/:movie_id', (req, res) => {
    const userIDToFind = req.params.user_id;
    const userToUpdate = users.find((user) => (user.id === userIDToFind));

    if (userToUpdate) {
      const movieIDToFind = req.params.movie_id;
      const indexOfMovieToDelete = userToUpdate.favoriteMovies.indexOf(movieIDToFind);
      const movieIDExistsInFavorites = indexOfMovieToDelete !== -1;

      if (movieIDExistsInFavorites) {
        userToUpdate.favoriteMovies.splice(indexOfMovieToDelete, 1);
        res.status(200).send(`Successfully removed movie with id: ${movieIDToFind} from favorites`);
      } else {
        res.status(400).send(`Movie with id: ${movieIDToFind} wasn't a favorite to begin with.`);
      }
    } else {
      res.status(404).send(`Couldn't find a user with id: "${userIDToFind}"`);
    }
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
