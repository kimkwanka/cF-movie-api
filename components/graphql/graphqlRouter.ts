import express from 'express';
import passport from 'passport';
import graphqlController from './graphqlController';

const graphqlRouter = express.Router();

graphqlRouter.post(
  '/graphql',
  passport.authenticate('jwt', { session: false }),
  graphqlController,
);

graphqlRouter.get(
  '/graphql',
  passport.authenticate('jwt', { session: false }),
  graphqlController,
);

export default graphqlRouter;
