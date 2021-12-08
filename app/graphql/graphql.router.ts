import express from 'express';

import apolloServer from '@graphql/graphql.server';

const graphqlRouter = express.Router();

const startApolloServer = async () => {
  await apolloServer.start();
  graphqlRouter.use(apolloServer.getMiddleware({ path: '/graphql' }));
};

startApolloServer();

export default graphqlRouter;
