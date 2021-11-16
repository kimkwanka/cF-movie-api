import { Request } from 'express';
import mongoose from 'mongoose';

import { body, validationResult } from 'express-validator';

import Users, { TUserDocument } from './usersModel';

import Movies from '../movies/moviesModel';

const findAllUsers = async () => Users.find({});

const findById = async (id: string) => Users.findById(id);

const validateAddUserRequestBody = async (req: Request) => {
  await body('username', 'username needs to be at least 5 characters')
    .isLength({ min: 5 })
    .run(req);
  await body(
    'username',
    'username must not contain non-alphanumeric characters',
  )
    .isAlphanumeric()
    .run(req);
  await body('password', 'password is required').not().isEmpty().run(req);
  await body('email', 'email does not appear to be valid').isEmail().run(req);

  return validationResult(req);
};

const validateUpdateUserRequestBody = async (req: Request) => {
  await body('username', 'username needs to be at least 5 characters')
    .isLength({ min: 5 })
    .run(req);
  await body(
    'username',
    'username must not contain non-alphanumeric characters',
  )
    .isAlphanumeric()
    .run(req);
  await body('email', 'email does not appear to be valid').isEmail().run(req);

  return validationResult(req);
};

const loginUser = async ({
  username,
  password,
}: {
  username: string;
  password: string;
}) => {
  try {
    const user = await Users.findOne({ username });

    const passwordMatch = user?.validatePassword(password);

    if (!user || !passwordMatch) {
      return {
        statusCode: 400,
        data: null,
        errors: [{ message: 'Invalid credentials.' }],
      };
    }

    return {
      statusCode: 200,
      data: user,
      errors: [],
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : err;

    console.error(errorMessage);
    return {
      statusCode: 500,
      data: null,
      errors: [{ message: errorMessage as string }],
    };
  }
};

const addUser = async ({
  username,
  password,
  email,
  birthday,
}: Partial<TUserDocument>) => {
  try {
    const errors: Array<{ message: string }> = [];

    const userWithUsername = await Users.findOne({ username });
    if (userWithUsername) {
      errors.push({ message: `'${username}' is already taken.` });
    }

    const userWithEmail = await Users.findOne({ email });
    if (userWithEmail) {
      errors.push({ message: `'${email}' is already taken.` });
    }

    if (errors.length) {
      return {
        statusCode: 400,
        data: null,
        errors,
      };
    }

    const hashedPassword = Users.hashPassword(password || '');

    const newUser = await Users.create({
      _id: new mongoose.Types.ObjectId(),
      username,
      password: hashedPassword,
      email,
      birthday,
    });

    return {
      statusCode: 201,
      data: newUser,
      errors: [],
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : err;

    console.error(errorMessage);
    return {
      statusCode: 500,
      data: null,
      errors: [{ message: errorMessage as string }],
    };
  }
};

const updateUser = async (
  userId: string,
  { username, password, email, birthday }: Partial<TUserDocument>,
) => {
  try {
    const errors: Array<{ message: string }> = [];

    const userToUpdate = await Users.findOne({ _id: userId });

    if (!userToUpdate) {
      return {
        statusCode: 404,
        data: null,
        errors: [{ message: `User with id: '${userId}' doesn't exist.` }],
      };
    }

    const userWithUsername = await Users.findOne({ username });
    if (userWithUsername) {
      const IdOfUserWithUsername = userWithUsername._id.toString();
      // We need to cast to string or else equality check will never be true
      // (_id is an object for some reason, whereas userId is a regular string)
      if (IdOfUserWithUsername !== userId) {
        errors.push({ message: `'${username}' is already taken.` });
      }
    }

    const userWithEmail = await Users.findOne({ email });
    if (userWithEmail) {
      const IdOfUserWithEmail = userWithEmail._id.toString();

      if (IdOfUserWithEmail !== userId) {
        errors.push({ message: `'${email}' is already taken.` });
      }
    }

    if (errors.length) {
      return {
        statusCode: 400,
        data: null,
        errors,
      };
    }

    userToUpdate.username = username || '';
    userToUpdate.email = email || '';
    userToUpdate.birthday = birthday || '';

    if (password !== userToUpdate.password) {
      userToUpdate.password = Users.hashPassword(password || '');
    }

    await userToUpdate.save();

    return {
      statusCode: 200,
      data: userToUpdate,
      errors,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : err;

    console.error(errorMessage);
    return {
      statusCode: 500,
      data: null,
      errors: [{ message: errorMessage as string }],
    };
  }
};

const deleteUser = async (userId: string) => {
  try {
    const userToDelete = await Users.findOneAndRemove({ _id: userId });

    if (!userToDelete) {
      return {
        statusCode: 404,
        data: null,
        errors: [{ message: `User with id: '${userId}' doesn't exist.` }],
      };
    }

    return {
      statusCode: 200,
      data: userToDelete,
      errors: [],
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : err;

    console.error(errorMessage);
    return {
      statusCode: 500,
      data: null,
      errors: [{ message: errorMessage as string }],
    };
  }
};

const addFavoriteMovieToUser = async (userId: string, movieId: string) => {
  try {
    const errors: Array<{ message: string }> = [];
    const userToUpdate = await Users.findOne({ _id: userId });

    if (!userToUpdate) {
      return {
        statusCode: 404,
        data: null,
        errors: [{ message: `User with id: ${userId} doesn't exist.` }],
      };
    }

    const movieIdAlreadyInFavorites =
      userToUpdate.favoriteMovies.includes(movieId);
    const movieFoundById = await Movies.findOne({ _id: movieId });
    const movieWithIdExists = movieFoundById !== null;

    if (movieIdAlreadyInFavorites) {
      errors.push({
        message: `Movie with id: ${movieId} is already a favorite.`,
      });
    }

    if (!movieWithIdExists) {
      errors.push({ message: `Movie with id: ${movieId} doesn't exist.` });
    }

    if (errors.length) {
      return {
        statusCode: 400,
        data: null,
        errors,
      };
    }

    userToUpdate.favoriteMovies.push(movieId);
    await userToUpdate.save();

    return {
      statusCode: 200,
      data: userToUpdate,
      errors: [],
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : err;

    console.error(errorMessage);
    return {
      statusCode: 500,
      data: null,
      errors: [{ message: errorMessage as string }],
    };
  }
};

const removeFavoriteMovieFromUser = async (userId: string, movieId: string) => {
  try {
    const userToUpdate = await Users.findOne({ _id: userId });

    if (!userToUpdate) {
      return {
        statusCode: 404,
        data: null,
        errors: [{ message: `User with id: ${userId} doesn't exist.` }],
      };
    }

    const indexOfMovieIdToDelete = userToUpdate.favoriteMovies.indexOf(movieId);
    const movieIdExistsInFavorites = indexOfMovieIdToDelete !== -1;

    if (!movieIdExistsInFavorites) {
      return {
        statusCode: 400,
        data: null,
        errors: [
          {
            message: `Movie with id: ${movieId} wasn't a favorite to begin with.`,
          },
        ],
      };
    }

    userToUpdate.favoriteMovies.splice(indexOfMovieIdToDelete, 1);
    await userToUpdate.save();

    return {
      statusCode: 200,
      data: userToUpdate,
      errors: [],
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : err;

    console.error(errorMessage);
    return {
      statusCode: 500,
      data: null,
      errors: [{ message: errorMessage as string }],
    };
  }
};

export default {
  validateAddUserRequestBody,
  validateUpdateUserRequestBody,
  addUser,
  updateUser,
  deleteUser,
  addFavoriteMovieToUser,
  removeFavoriteMovieFromUser,
  findAllUsers,
  loginUser,
  findById,
};
