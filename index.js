/* eslint-disable max-len */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* eslint camelcase: ["error", { allow: ["user_id", "movie_id"]}] */

const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const Models = require('./models');

const {
  Movies, Users,
} = Models;

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

const PORT = process.env.PORT || 8080;

const app = express();

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

  expressApp.get('/movies', async (req, res) => res.send(await Movies.find({})));

  expressApp.get('/movies/:title', async (req, res) => {
    const movieTitleToFind = req.params.title;
    const movieToFindByTitle = await Movies.findOne({ Title: movieTitleToFind });

    if (movieToFindByTitle) {
      return res.send(movieToFindByTitle);
    }
    return res.status(404).send(`Couldn't find a movie with title: "${movieTitleToFind}"`);
  });

  expressApp.get('/genres/:name', async (req, res) => {
    const genreNameToFind = req.params.name;
    const movieWithGenre = await Movies.findOne({ 'Genre.Name': genreNameToFind });

    if (movieWithGenre) {
      return res.send(movieWithGenre.Genre);
    }
    return res.status(404).send(`Couldn't find a genre with name: "${genreNameToFind}"`);
  });

  expressApp.get('/directors/:name', async (req, res) => {
    const directorNameToFind = req.params.name;
    const movieWithDirector = await Movies.findOne({ 'Director.Name': directorNameToFind });

    if (movieWithDirector) {
      return res.send(movieWithDirector.Director);
    }
    return res.status(404).send(`Couldn't find a director with name: "${directorNameToFind}"`);
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

  expressApp.put('/users/:user_id', async (req, res) => {
    const {
      Username, Password, Email, Birthday,
    } = req.body;

    const { user_id: _id } = req.params;

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

  expressApp.delete('/users/:user_id', async (req, res) => {
    const { user_id: _id } = req.params;

    try {
      const userToDelete = await Users.findOneAndRemove({ _id });
      if (!userToDelete) {
        return res.status(400).send(`User with id: ${_id} doesn't exist.`);
      }
      return res.status(200).send(`User with ID ${_id} was successfully removed.`);
    } catch (error) {
      console.error(error);
      return res.status(500).send(`Error: ${error}`);
    }
  });

  expressApp.post('/users/:user_id/movies/:movie_id', async (req, res) => {
    const {
      user_id, movie_id,
    } = req.params;

    try {
      const userToUpdate = await Users.findOne({ _id: user_id });

      if (userToUpdate) {
        const movieIDAlreadyInFavorites = userToUpdate.FavoriteMovies.includes(movie_id);
        const movieFoundByID = await Movies.findOne({ _id: movie_id });
        const movieWithIDExists = movieFoundByID !== null;

        if (movieIDAlreadyInFavorites) {
          return res.status(400).send(`Movie with id: ${movie_id} is already a favorite.`);
        }

        if (!movieWithIDExists) {
          return res.status(400).send(`Movie with id: ${movie_id} doesn't exist.`);
        }

        userToUpdate.FavoriteMovies.push(movie_id);
        await userToUpdate.save();
        return res.status(200).send(`Successfully added movie with id: ${movie_id} to favorites`);
      }
      return res.status(400).send(`User with id: ${user_id} doesn't exist.`);
    } catch (error) {
      console.error(error);
      return res.status(500).send(`Error: ${error}`);
    }
  });

  expressApp.delete('/users/:user_id/movies/:movie_id', async (req, res) => {
    const {
      user_id, movie_id,
    } = req.params;

    try {
      const userToUpdate = await Users.findOne({ _id: user_id });

      if (userToUpdate) {
        const indexOfMovieIDToDelete = userToUpdate.FavoriteMovies.indexOf(movie_id);
        const movieIDExistsInFavorites = indexOfMovieIDToDelete !== -1;

        if (movieIDExistsInFavorites) {
          userToUpdate.FavoriteMovies.splice(indexOfMovieIDToDelete, 1);
          await userToUpdate.save();
          return res.status(200).send(`Successfully removed movie with id: ${movie_id} from favorites.`);
        }

        return res.status(400).send(`Movie with id: ${movie_id} wasn't a favorite to begin with.`);
      }
      return res.status(400).send(`User with id: ${user_id} doesn't exist.`);
    } catch (error) {
      console.error(error);
      return res.status(500).send(`Error: ${error}`);
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
