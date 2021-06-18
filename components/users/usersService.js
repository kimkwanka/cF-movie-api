/* eslint-disable max-len */
/* eslint no-console: ["error", { allow: ["warn", "error"] }] */
/* eslint camelcase: ["error", { allow: ["user_id", "movie_id"]}] */
const mongoose = require('mongoose');
const { Movies, Users } = require('../../models');

mongoose.connect('mongodb://localhost:27017/myFlixDB', { useNewUrlParser: true, useUnifiedTopology: true });

const addUser = async ({
  Username, Password, Email, Birthday,
}) => {
  try {
    const alreadyExistingUser = await Users.findOne({ Username });
    if (alreadyExistingUser) {
      return { statusCode: 400, body: `${Username} already exists.` };
    }

    const newUser = await Users.create({
      Username, Password, Email, Birthday,
    });

    return { statusCode: 201, body: newUser };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: `Error: ${e}` };
  }
};

const updateUser = async (user_id, {
  Username, Password, Email, Birthday,
}) => {
  try {
    const updatedUser = await Users.findOneAndUpdate({ _id: user_id }, {
      $set: {
        Username, Password, Email, Birthday,
      },
    }, {
      new: true,
    });
    return { statusCode: 200, body: updatedUser };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: `Error: ${e}` };
  }
};

const deleteUser = async (user_id) => {
  try {
    const userToDelete = await Users.findOneAndRemove({ _id: user_id });
    if (!userToDelete) {
      return { statusCode: 400, body: `User with id: ${user_id} doesn't exist.` };
    }
    return { statusCode: 200, body: `User with ID ${user_id} was successfully removed.` };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: `Error: ${e}` };
  }
};

const addFavoriteMovieToUser = async (user_id, movie_id) => {
  try {
    const userToUpdate = await Users.findOne({ _id: user_id });

    if (userToUpdate) {
      const movieIDAlreadyInFavorites = userToUpdate.FavoriteMovies.includes(movie_id);
      const movieFoundByID = await Movies.findOne({ _id: movie_id });
      const movieWithIDExists = movieFoundByID !== null;

      if (movieIDAlreadyInFavorites) {
        return { statusCode: 400, body: `Movie with id: ${movie_id} is already a favorite.` };
      }

      if (!movieWithIDExists) {
        return { statusCode: 400, body: `Movie with id: ${movie_id} doesn't exist.` };
      }

      userToUpdate.FavoriteMovies.push(movie_id);
      await userToUpdate.save();
      return { statusCode: 200, body: `Successfully added movie with id: ${movie_id} to favorites` };
    }
    return { statusCode: 400, body: `User with id: ${user_id} doesn't exist.` };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: `Error: ${e}` };
  }
};

const removeFavoriteMovieFromUser = async (user_id, movie_id) => {
  try {
    const userToUpdate = await Users.findOne({ _id: user_id });

    if (userToUpdate) {
      const indexOfMovieIDToDelete = userToUpdate.FavoriteMovies.indexOf(movie_id);
      const movieIDExistsInFavorites = indexOfMovieIDToDelete !== -1;

      if (movieIDExistsInFavorites) {
        userToUpdate.FavoriteMovies.splice(indexOfMovieIDToDelete, 1);
        await userToUpdate.save();
        return { statusCode: 200, body: `Successfully removed movie with id: ${movie_id} from favorites.` };
      }
      return { statusCode: 400, body: `Movie with id: ${movie_id} wasn't a favorite to begin with.` };
    }
    return { statusCode: 400, body: `User with id: ${user_id} doesn't exist.` };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: `Error: ${e}` };
  }
};

module.exports = {
  addUser,
  updateUser,
  deleteUser,
  addFavoriteMovieToUser,
  removeFavoriteMovieFromUser,
};
