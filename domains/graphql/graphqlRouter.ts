import express from 'express';
import fs from 'fs';
import path from 'path';

import { ApolloServer } from 'apollo-server-express';

import resolvers from './graphqlResolvers';

const typeDefs = fs.readFileSync(
  path.join(__dirname, 'schema.graphql'),
  'utf8',
);

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const graphqlRouter = express.Router();

const startApolloServer = async () => {
  await server.start();
  graphqlRouter.use(server.getMiddleware({ path: '/graphql' }));
};

startApolloServer();

export default graphqlRouter;
