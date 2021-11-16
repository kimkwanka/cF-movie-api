import express from 'express';
import passport from 'passport';
import { ApolloServer } from 'apollo-server-express';

import typeDefs from './graphqlTypeDefs';
import resolvers from './graphqlResolvers';

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

const graphqlRouter = express.Router();

const startApolloServer = async () => {
  await server.start();
  graphqlRouter.use(
    // passport.authenticate('jwt', { session: false }),
    server.getMiddleware({ path: '/graphql' }),
  );
};

startApolloServer();

export default graphqlRouter;
