import express from 'express';

import authController from '@auth/authController';

import tmdbController from './tmdbController';

const tmdbRouter = express.Router();

tmdbRouter.get(
  '/tmdb/*',
  authController.requireAuthentication,
  tmdbController.tmdbQuery,
);

export default tmdbRouter;
