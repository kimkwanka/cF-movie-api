const { body, validationResult } = require('express-validator');

const Users = require('./usersModel');
const Movies = require('../movies/moviesModel');

const validateAddUserRequestBody = async (req) => {
  await body('username', 'username needs to be at least 5 characters').isLength({ min: 5 }).run(req);
  await body('username', 'username must not contain non-alphanumeric characters').isAlphanumeric().run(req);
  await body('password', 'password is required').not().isEmpty().run(req);
  await body('email', 'email does not appear to be valid').isEmail().run(req);

  return validationResult(req);
};

const validateUpdateUserRequestBody = async (req) => {
  await body('username', 'username needs to be at least 5 characters').isLength({ min: 5 }).run(req);
  await body('username', 'username must not contain non-alphanumeric characters').isAlphanumeric().run(req);
  await body('email', 'email does not appear to be valid').isEmail().run(req);

  return validationResult(req);
};

const addUser = async ({
  username, password, email, birthday,
}) => {
  try {
    const userWithUsername = await Users.findOne({ username });
    if (userWithUsername) {
      return { statusCode: 400, body: `${username} already exists.` };
    }

    const userWithEmail = await Users.findOne({ email });
    if (userWithEmail) {
      return { statusCode: 400, body: `${email} already exists.` };
    }

    const hashedPassword = Users.hashPassword(password);

    const newUser = await Users.create({
      username, password: hashedPassword, email, birthday,
    });

    return { statusCode: 201, body: newUser };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: `Error: ${e}` };
  }
};

const updateUser = async (userId, {
  username, password, email, birthday,
}) => {
  try {
    const userToUpdate = await Users.findOne({ _id: userId });

    if (!userToUpdate) {
      return { statusCode: 404, body: `User with id: ${userId} doesn't exist.` };
    }

    const userWithUsername = await Users.findOne({ username });
    if (userWithUsername) {
      const IdOfUserWithUsername = userWithUsername._id.toString();
      // We need to cast to string or else equality check will never be true
      // (_id is an object for some reason, whereas userId is a regular string)
      if (IdOfUserWithUsername !== userId) {
        return { statusCode: 400, body: `${username} already exists.` };
      }
    }

    const userWithEmail = await Users.findOne({ email });
    if (userWithEmail) {
      const IdOfUserWithEmail = userWithEmail._id.toString();

      if (IdOfUserWithEmail !== userId) {
        return { statusCode: 400, body: `${email} already exists.` };
      }
    }

    userToUpdate.username = username;
    userToUpdate.email = email;
    userToUpdate.birthday = birthday;

    if (password !== userToUpdate.password) {
      userToUpdate.password = Users.hashPassword(password);
    }

    await userToUpdate.save();

    return { statusCode: 200, body: userToUpdate };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: `Error: ${e}` };
  }
};

const deleteUser = async (userId) => {
  try {
    const userToDelete = await Users.findOneAndRemove({ _id: userId });

    if (!userToDelete) {
      return { statusCode: 404, body: `User with id: ${userId} doesn't exist.` };
    }

    return { statusCode: 200, body: `User with Id ${userId} was successfully removed.` };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: `Error: ${e}` };
  }
};

const addFavoriteMovieToUser = async (userId, movieId) => {
  try {
    const userToUpdate = await Users.findOne({ _id: userId });

    if (!userToUpdate) {
      return { statusCode: 404, body: `User with id: ${userId} doesn't exist.` };
    }

    const movieIdAlreadyInFavorites = userToUpdate.favoriteMovies.includes(movieId);
    const movieFoundById = await Movies.findOne({ _id: movieId });
    const movieWithIdExists = movieFoundById !== null;

    if (movieIdAlreadyInFavorites) {
      return { statusCode: 400, body: `Movie with id: ${movieId} is already a favorite.` };
    }

    if (!movieWithIdExists) {
      return { statusCode: 404, body: `Movie with id: ${movieId} doesn't exist.` };
    }

    userToUpdate.favoriteMovies.push(movieId);
    await userToUpdate.save();

    return { statusCode: 200, body: `Successfully added movie with id: ${movieId} to favorites` };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: `Error: ${e}` };
  }
};

const removeFavoriteMovieFromUser = async (userId, movieId) => {
  try {
    const userToUpdate = await Users.findOne({ _id: userId });

    if (!userToUpdate) {
      return { statusCode: 404, body: `User with id: ${userId} doesn't exist.` };
    }

    const indexOfMovieIdToDelete = userToUpdate.favoriteMovies.indexOf(movieId);
    const movieIdExistsInFavorites = indexOfMovieIdToDelete !== -1;

    if (!movieIdExistsInFavorites) {
      return { statusCode: 400, body: `Movie with id: ${movieId} wasn't a favorite to begin with.` };
    }

    userToUpdate.favoriteMovies.splice(indexOfMovieIdToDelete, 1);
    await userToUpdate.save();

    return { statusCode: 200, body: `Successfully removed movie with id: ${movieId} from favorites.` };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: `Error: ${e}` };
  }
};

module.exports = {
  validateAddUserRequestBody,
  validateUpdateUserRequestBody,
  addUser,
  updateUser,
  deleteUser,
  addFavoriteMovieToUser,
  removeFavoriteMovieFromUser,
};
