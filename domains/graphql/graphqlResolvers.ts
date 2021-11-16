import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';
import { TUserDocument } from '../users/usersModel';
import { Resolvers, User, AuthPayload, Error } from './types';

import usersService from '../users/usersService';

const TMDB_BASE_API_URL = 'https://api.themoviedb.org/3';

const authorizedFetch = async (apiEndpoint: string) => {
  try {
    const response = await fetch(`${TMDB_BASE_API_URL}${apiEndpoint}`, {
      headers: { Authorization: `Bearer ${process.env.TMDB_API_TOKEN}` },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

const generateJWTToken = (user: User) =>
  jwt.sign(user, process.env.JWT_SECRET as jwt.Secret, {
    subject: user.username,
    expiresIn: '7d',
    algorithm: 'HS256',
  });

const resolvers: Resolvers = {
  Query: {
    discover: async (
      _,
      __,
      context: { tmdbConfiguration: object | undefined },
    ) => {
      if (!context.tmdbConfiguration) {
        context.tmdbConfiguration = (
          await authorizedFetch('/configuration')
        ).images;
      }

      return (await authorizedFetch('/discover/movie')).results;
    },

    movie: async (_, { id }) => authorizedFetch(`/movie/${id}`),

    users: async () => {
      const users = await usersService.findAllUsers();
      return users;
    },
  },
  Mutation: {
    registerUser: async (_, { newUserData }) => {
      const { statusCode, data, errors } = await usersService.addUser(
        newUserData,
      );
      return { statusCode, user: data, errors };
    },

    updateUser: async (_, { _id, newUserData }) => {
      const { statusCode, data, errors } = await usersService.updateUser(
        _id,
        newUserData,
      );
      return { statusCode, user: data, errors };
    },

    deleteUser: async (_, { _id }) => {
      const { statusCode, data, errors } = await usersService.deleteUser(_id);
      return { statusCode, user: data, errors };
    },

    addFavoriteMovieToUser: async (_, { _id, movieId }) => {
      const { statusCode, data, errors } =
        await usersService.addFavoriteMovieToUser(_id, movieId);
      return { statusCode, user: data, errors };
    },

    removeFavoriteMovieFromUser: async (_, { _id, movieId }) => {
      const { statusCode, data, errors } =
        await usersService.removeFavoriteMovieFromUser(_id, movieId);
      return { statusCode, user: data, errors };
    },

    loginUser: async (_, { username, password }) => {
      try {
        const { statusCode, data, errors } = await usersService.loginUser({
          username,
          password,
        });

        const token = generateJWTToken((data as TUserDocument).toJSON());

        return { statusCode, user: data, token, errors } as AuthPayload;
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : err;

        console.error(errorMessage);
        return {
          data: null,
          errors: [{ message: errorMessage as string }],
        };
      }
    },
  },
};

export default resolvers;
