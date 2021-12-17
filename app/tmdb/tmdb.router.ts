import express from 'express';

import authController from '#auth/auth.controller';

import tmdbController from '#tmdb/tmdb.controller';

const tmdbRouter = express.Router();

tmdbRouter.get(
  '/tmdb/*',
  authController.requireAuthentication,
  tmdbController.tmdbProxyRequest,
);

export default tmdbRouter;
