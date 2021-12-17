import express from 'express';

import graphqlController from '#graphql/graphql.controller';

const graphqlRouter = express.Router();

graphqlRouter.use(graphqlController.apolloMiddleware);

export default graphqlRouter;
