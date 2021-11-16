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
      try {
        const userOrErrorMsg = (await usersService.addUser(newUserData)).body;

        if (typeof userOrErrorMsg === 'string') {
          return { message: userOrErrorMsg };
        }

        return userOrErrorMsg;
      } catch (error) {
        console.error(error);
        return { message: error } as Error;
      }
    },
    updateUser: async (_, { _id, newUserData }) => {
      try {
        const userOrErrorMsg = (await usersService.updateUser(_id, newUserData))
          .body;

        if (typeof userOrErrorMsg === 'string') {
          return { message: userOrErrorMsg };
        }

        return userOrErrorMsg;
      } catch (error) {
        console.error(error);
        return { message: error } as Error;
      }
    },
    deleteUser: async (_, { _id }) => {
      try {
        const userOrErrorMsg = (await usersService.deleteUser(_id)).body;

        if (typeof userOrErrorMsg === 'string') {
          return { message: userOrErrorMsg };
        }

        return userOrErrorMsg;
      } catch (error) {
        console.error(error);
        return { message: error } as Error;
      }
    },
    addFavoriteMovieToUser: async (_, { _id, movieId }) => {
      try {
        const userOrErrorMsg = (
          await usersService.addFavoriteMovieToUser(_id, movieId)
        ).body;

        if (typeof userOrErrorMsg === 'string') {
          return { message: userOrErrorMsg };
        }

        return userOrErrorMsg;
      } catch (error) {
        console.error(error);
        return { message: error } as Error;
      }
    },
    removeFavoriteMovieFromUser: async (_, { _id, movieId }) => {
      try {
        const userOrErrorMsg = (
          await usersService.removeFavoriteMovieFromUser(_id, movieId)
        ).body;

        if (typeof userOrErrorMsg === 'string') {
          return { message: userOrErrorMsg };
        }

        return userOrErrorMsg;
      } catch (error) {
        console.error(error);
        return { message: error } as Error;
      }
    },
    loginUser: async (_, { username, password }) => {
      try {
        const userOrErrorMsg = await usersService.loginUser({
          username,
          password,
        });

        if ((userOrErrorMsg as Error).message) {
          return userOrErrorMsg as Error;
        }

        const token = generateJWTToken(
          (userOrErrorMsg as TUserDocument).toJSON(),
        );

        return { user: userOrErrorMsg, token } as AuthPayload;
      } catch (err) {
        console.error(err);
        return { message: err } as Error;
      }
    },
  },
  UserOrError: {
    __resolveType: (obj) => ((obj as Error).message ? 'Error' : 'User'),
  },
  AuthPayloadOrError: {
    __resolveType: (obj) => ((obj as Error).message ? 'Error' : 'AuthPayload'),
  },
};

export default resolvers;
