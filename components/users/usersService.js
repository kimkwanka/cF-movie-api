const { body, validationResult } = require('express-validator');

const Users = require('./usersModel');
const Movies = require('../movies/moviesModel');

const validateAddUserRequestBody = async (req) => {
  await body('Username', 'Username needs to be at least 5 characters').isLength({ min: 5 }).run(req);
  await body('Username', 'Username must not contain non-alphanumeric characters').isAlphanumeric().run(req);
  await body('Password', 'Password is required').not().isEmpty().run(req);
  await body('Email', 'Email does not appear to be valid').isEmail().run(req);

  return validationResult(req);
};

const validateUpdateUserRequestBody = async (req) => {
  await body('Username', 'Username needs to be at least 5 characters').isLength({ min: 5 }).run(req);
  await body('Username', 'Username must not contain non-alphanumeric characters').isAlphanumeric().run(req);
  await body('Email', 'Email does not appear to be valid').isEmail().run(req);

  return validationResult(req);
};

const addUser = async ({
  Username, Password, Email, Birthday,
}) => {
  try {
    const userWithUsername = await Users.findOne({ Username });
    if (userWithUsername) {
      return { statusCode: 400, body: `${Username} already exists.` };
    }

    const userWithEmail = await Users.findOne({ Email });
    if (userWithEmail) {
      return { statusCode: 400, body: `${Email} already exists.` };
    }

    const hashedPassword = Users.hashPassword(Password);

    const newUser = await Users.create({
      Username, Password: hashedPassword, Email, Birthday,
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
    const userToUpdate = await Users.findOne({ _id: user_id });

    if (!userToUpdate) {
      return { statusCode: 404, body: `User with id: ${user_id} doesn't exist.` };
    }

    const userWithUsername = await Users.findOne({ Username });
    if (userWithUsername) {
      const IDOfUserWithUsername = userWithUsername._id.toString();
      // We need to cast to string or else equality check will never be true
      // (_id is an object for some reason, whereas user_id is a regular string)
      if (IDOfUserWithUsername !== user_id) {
        return { statusCode: 400, body: `${Username} already exists.` };
      }
    }

    const userWithEmail = await Users.findOne({ Email });
    if (userWithEmail) {
      const IDOfUserWithEmail = userWithEmail._id.toString();

      if (IDOfUserWithEmail !== user_id) {
        return { statusCode: 400, body: `${Email} already exists.` };
      }
    }

    userToUpdate.Username = Username;
    userToUpdate.Email = Email;
    userToUpdate.Birthday = Birthday;

    if (Password !== userToUpdate.Password) {
      userToUpdate.Password = Users.hashPassword(Password);
    }

    await userToUpdate.save();

    return { statusCode: 200, body: userToUpdate };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: `Error: ${e}` };
  }
};

const deleteUser = async (user_id) => {
  try {
    const userToDelete = await Users.findOneAndRemove({ _id: user_id });

    if (!userToDelete) {
      return { statusCode: 404, body: `User with id: ${user_id} doesn't exist.` };
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

    if (!userToUpdate) {
      return { statusCode: 404, body: `User with id: ${user_id} doesn't exist.` };
    }

    const movieIDAlreadyInFavorites = userToUpdate.FavoriteMovies.includes(movie_id);
    const movieFoundByID = await Movies.findOne({ _id: movie_id });
    const movieWithIDExists = movieFoundByID !== null;

    if (movieIDAlreadyInFavorites) {
      return { statusCode: 400, body: `Movie with id: ${movie_id} is already a favorite.` };
    }

    if (!movieWithIDExists) {
      return { statusCode: 404, body: `Movie with id: ${movie_id} doesn't exist.` };
    }

    userToUpdate.FavoriteMovies.push(movie_id);
    await userToUpdate.save();

    return { statusCode: 200, body: `Successfully added movie with id: ${movie_id} to favorites` };
  } catch (e) {
    console.error(e);
    return { statusCode: 500, body: `Error: ${e}` };
  }
};

const removeFavoriteMovieFromUser = async (user_id, movie_id) => {
  try {
    const userToUpdate = await Users.findOne({ _id: user_id });

    if (!userToUpdate) {
      return { statusCode: 404, body: `User with id: ${user_id} doesn't exist.` };
    }

    const indexOfMovieIDToDelete = userToUpdate.FavoriteMovies.indexOf(movie_id);
    const movieIDExistsInFavorites = indexOfMovieIDToDelete !== -1;

    if (!movieIDExistsInFavorites) {
      return { statusCode: 400, body: `Movie with id: ${movie_id} wasn't a favorite to begin with.` };
    }

    userToUpdate.FavoriteMovies.splice(indexOfMovieIDToDelete, 1);
    await userToUpdate.save();

    return { statusCode: 200, body: `Successfully removed movie with id: ${movie_id} from favorites.` };
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
