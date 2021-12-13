import { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';

import { ApolloServer } from 'apollo-server-express';

import { getAuthStatus, TAuthorizedRequest } from '@graphql/graphql.service';
import { tmdbFetch } from '@tmdb/tmdb.service';

import resolvers from '@graphql/graphql.resolvers';

const typeDefs = fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf8',
);

const apolloServer = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }: { req: TAuthorizedRequest }) => {
    const token = req?.headers?.authorization?.slice?.(7);

    return {
      req,
      tmdbConfiguration: (await tmdbFetch('/configuration')).data.images,
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
