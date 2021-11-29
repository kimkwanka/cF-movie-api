import { Resolvers } from '@generated/types';

import { authenticateOperation } from '@utils/graphql';
import { tmdbFetch } from '@utils/tmdb';

import {
  generateJWTToken,
  generateRefreshTokenData,
  addRefreshTokenToWhitelist,
} from '@utils/jwt';

import usersService from '../users/usersService';

const resolvers: Resolvers = {
  TMDBMovieSimple: {
    id: (parent) => parent.id.toString(),
  },
  Query: {
    discover: async () => {
      return (await tmdbFetch('/discover/movie')).results;
    },

    movie: async (_, { id }) => tmdbFetch(`/movie/${id}`),

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

    updateUser: async (_, { _id, newUserData }, { authStatus }) => {
      const { statusCode, data, errors } = await authenticateOperation(
        authStatus,
        _id,
        async () => usersService.updateUser(_id, newUserData),
      );
      return { statusCode, user: data, errors };
    },

    deleteUser: async (_, { _id }, { authStatus }) => {
      const { statusCode, data, errors } = await authenticateOperation(
        authStatus,
        _id,
        async () => usersService.deleteUser(_id),
      );
      return { statusCode, user: data, errors };
    },

    addFavoriteMovieToUser: async (_, { _id, movieId }, { authStatus }) => {
      const { statusCode, data, errors } = await authenticateOperation(
        authStatus,
        _id,
        async () => usersService.addFavoriteMovieToUser(_id, movieId),
      );
      return { statusCode, user: data, errors };
    },

    removeFavoriteMovieFromUser: async (
      _,
      { _id, movieId },
      { authStatus },
    ) => {
      const { statusCode, data, errors } = await authenticateOperation(
        authStatus,
        _id,
        async () => usersService.removeFavoriteMovieFromUser(_id, movieId),
      );
      return { statusCode, user: data, errors };
    },

    loginUser: async (_, { username, password }) => {
      try {
        const {
          statusCode,
          data: user,
          errors,
        } = await usersService.loginUser({
          username,
          password,
        });
        let refreshTokenData = null;
        let jwtToken = '';

        if (user) {
          const userId = user._id.toString();
          const { passwordHash } = user;

          refreshTokenData = generateRefreshTokenData({
            userId,
            passwordHash,
          });

          jwtToken = generateJWTToken({
            userId,
            passwordHash,
          });

          if (refreshTokenData) {
            addRefreshTokenToWhitelist(refreshTokenData);
          }
        }

        return { statusCode, user, jwtToken, refreshTokenData, errors };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : err;

        console.error(errorMessage);
        return {
          statusCode: 500,
          data: null,
          jwtToken: '',
          refreshTokenData: null,
          errors: [{ message: errorMessage as string }],
        };
      }
    },
  },
};

export default resolvers;
