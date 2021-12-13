import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

import { ApolloServer } from 'apollo-server-express';

import { getAuthStatus, TAuthorizedRequest } from '@graphql/graphql.service';
import { tmdbFetch } from '@tmdb/tmdb.service';

import resolvers from '@graphql/graphql.resolvers';

import { TmdbImageBaseUrls, TmdbGenre } from '@generated/types';

const typeDefs = fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf8',
);

let imageBaseUrls: TmdbImageBaseUrls | undefined;
let genreLookupTable: Record<number, TmdbGenre> | undefined;

const getImageBaseUrls = async () => {
  if (!imageBaseUrls) {
    const config = (await tmdbFetch('/configuration')).data.images;

    if (config) {
      imageBaseUrls = {
        posterBaseUrl:
          config.secure_base_url +
          config.poster_sizes[config.poster_sizes.length - 2],
        profileBaseUrl:
          config.secure_base_url +
          config.profile_sizes[config.profile_sizes.length - 2],
        backdropBaseUrl:
          config.secure_base_url +
          config.backdrop_sizes[config.backdrop_sizes.length - 2],
      };
    }
  }
  return imageBaseUrls;
};

const getGenreLookupTable = async () => {
  if (!genreLookupTable) {
    const { genres } = (await tmdbFetch('/genre/movie/list')).data;

    if (genres) {
      genreLookupTable = genres.reduce(
        (acc: Record<number, TmdbGenre>, genre: TmdbGenre) => {
          acc[genre.id] = genre;
          return acc;
        },
        {},
      );
    }
  }
  return genreLookupTable;
};

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, res }: { req: TAuthorizedRequest; res: Response }) => {
    const token = req?.headers?.authorization?.slice?.(7);

    return {
      req,
      res,
      imageBaseUrls: await getImageBaseUrls(),
      genreLookupTable: await getGenreLookupTable(),
      authStatus: await getAuthStatus(token),
    };
  },
});

let isServerRunning = false;

const apolloMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (!isServerRunning) {
    await apolloServer.start();
    isServerRunning = true;
  }
  return apolloServer.getMiddleware({
    cors: {
      origin: [
        /http(s)?:\/\/(.+\.)?localhost(:\d{1,5})?$/,
        'https://graphflix.netlify.app',
        'https://studio.apollographql.com',
      ],
      credentials: true,
    },
    path: '/graphql',
  })(req, res, next);
};

export default {
  apolloMiddleware,
};
