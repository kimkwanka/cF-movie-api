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

export default apolloServer;
