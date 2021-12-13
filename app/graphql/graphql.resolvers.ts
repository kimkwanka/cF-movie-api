import { AuthenticationError } from 'apollo-server-express';

import { Resolvers } from '@generated/types';

import {
  requireAuthentication,
  requireAuthorization,
} from '@graphql/graphql.service';

import { tmdbFetch } from '@tmdb/tmdb.service';

import {
  addRefreshTokenToWhitelist,
  generateJWTToken,
  generateRefreshTokenData,
  REFRESH_TOKEN_EXPIRATION_IN_SECONDS,
  refreshAllTokens,
} from '@auth/auth.service';

import usersService from '@users/users.service';

const resolvers: Resolvers = {
  TMDBMovieSimple: {
    id: (movie) => movie.id.toString(),
    backdropUrl: (movie, _, { imageBaseUrls }) =>
      movie.backdrop_path && imageBaseUrls
        ? imageBaseUrls.backdropBaseUrl + movie.backdrop_path
        : '',
    posterUrl: (movie, _, { imageBaseUrls }) =>
      movie.poster_path && imageBaseUrls
        ? imageBaseUrls.posterBaseUrl + movie.poster_path
        : '',
    genres: (movie, _, { genreLookupTable }) =>
      movie.genre_ids.map((genreId) =>
        genreLookupTable ? genreLookupTable[genreId] : { id: -1, name: '' },
      ),
  },
  TMDBMovieDetailed: {
    id: (movie) => movie.id.toString(),
    backdropUrl: (movie, _, { imageBaseUrls }) =>
      movie.backdrop_path && imageBaseUrls
        ? imageBaseUrls.backdropBaseUrl + movie.backdrop_path
        : '',
    posterUrl: (movie, _, { imageBaseUrls }) =>
      movie.poster_path && imageBaseUrls
        ? imageBaseUrls.posterBaseUrl + movie.poster_path
        : '',
  },
  Query: {
    discover: async (
      _,
      { options: { page = 1, ...restArgs } },
      { authStatus },
    ) => {
      const queryArgsArray: string[] = [];
      Object.entries(restArgs).forEach(([key, value]) => {
        queryArgsArray.push(`&${key}=${value}`);
      });

      const { data, errors } = await requireAuthentication(
        authStatus,
        async () =>
          tmdbFetch(`/discover/movie?page=${page}${queryArgsArray.join('')}`),
      );

      if (data?.results) {
        return {
          movies: data.results,
          totalPages: data.total_pages,
          totalResults: data.total_results,
        };
      }

      throw new AuthenticationError(errors[0].message);
    },

    movie: async (_, { id }) => (await tmdbFetch(`/movie/${id}`)).data,

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
      const { statusCode, data, errors } = await requireAuthorization(
        authStatus,
        _id,
        async () => usersService.updateUser(_id, newUserData),
      );
      return { statusCode, user: data, errors };
    },

    deleteUser: async (_, { _id }, { authStatus }) => {
      const { statusCode, data, errors } = await requireAuthorization(
        authStatus,
        _id,
        async () => usersService.deleteUser(_id),
      );
      return { statusCode, user: data, errors };
    },

    addFavoriteMovieToUser: async (_, { _id, movieId }, { authStatus }) => {
      const { statusCode, data, errors } = await requireAuthorization(
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
      const { statusCode, data, errors } = await requireAuthorization(
        authStatus,
        _id,
        async () => usersService.removeFavoriteMovieFromUser(_id, movieId),
      );
      return { statusCode, user: data, errors };
    },

    loginUser: async (_, { username, password }, { res }) => {
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

          res.cookie('refreshToken', refreshTokenData.refreshToken, {
            maxAge: REFRESH_TOKEN_EXPIRATION_IN_SECONDS * 1000,
            httpOnly: true,
            secure: true,
            sameSite: 'none',
          });
        }

        return { statusCode, user, jwtToken, refreshTokenData, errors };
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : err;

        console.error(errorMessage);
        return {
          statusCode: 500,
          user: null,
          jwtToken: '',
          refreshTokenData: null,
          errors: [{ message: errorMessage as string }],
        };
      }
    },

    silentRefresh: async (_, __, { req, res }) => {
      const { refreshToken }: { refreshToken: string } = req.cookies;

      const { user, jwtToken, refreshTokenData } = await refreshAllTokens(
        refreshToken,
      );

      if (!refreshTokenData) {
        res.cookie('refreshToken', '', {
          expires: new Date(0),
          httpOnly: true,
          secure: true,
          sameSite: 'none',
        });

        return {
          statusCode: 400,
          user: null,
          jwtToken: '',
          errors: [{ message: 'Authentication Error: Invalid refresh token.' }],
        };
      }

      res.cookie('refreshToken', refreshTokenData.refreshToken, {
        maxAge: REFRESH_TOKEN_EXPIRATION_IN_SECONDS * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      return {
        statusCode: 200,
        user,
        jwtToken,
        errors: [],
      };
    },
  },
};

export default resolvers;
