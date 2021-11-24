import { Resolvers } from '@generated/types';

import { authorizedFetch, authenticateOperation } from '@utils/graphql';
import {
  generateJWTToken,
  generateRefreshTokenData,
  storeRefreshTokenData,
} from '@utils/jwt';

import usersService from '../users/usersService';

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
        const { statusCode, data, errors } = await usersService.loginUser({
          username,
          password,
        });

        const userId = data?._id?.toString?.();

        const jwtToken = userId ? generateJWTToken(userId) : '';

        const refreshToken = userId ? generateRefreshTokenData(userId) : null;

        if (refreshToken) {
          storeRefreshTokenData(refreshToken);
        }

        return { statusCode, user: data, jwtToken, refreshToken, errors };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : err;

        console.error(errorMessage);
        return {
          statusCode: 500,
          data: null,
          jwtToken: '',
          refreshToken: null,
          errors: [{ message: errorMessage as string }],
        };
      }
    },
  },
};

export default resolvers;
