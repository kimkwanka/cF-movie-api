/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* eslint camelcase: ["error", { allow: ["user_id", "movie_id"]}] */
const mongoose = require('mongoose');
const { Movies, Users } = require('../../models');

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

const addUser = async (req, res) => {
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
};

const updateUser = async (req, res) => {
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
};

const deleteUser = async (req, res) => {
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
};

const addFavoriteMovieToUser = async (req, res) => {
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
};

const removeFavoriteMovieFromUser = async (req, res) => {
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
};

module.exports = {
  addUser,
  updateUser,
  deleteUser,
  addFavoriteMovieToUser,
  removeFavoriteMovieFromUser,
};
