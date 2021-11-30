/* eslint-disable no-console */
import express, { Request, Response, Application, NextFunction } from 'express';

import morgan from 'morgan';
import cors from 'cors';

import cookieParser from 'cookie-parser';

import ip from 'ip';

import authRouter from '@auth/authRouter';
import moviesRouter from '@movies/moviesRouter';
import usersRouter from '@users/usersRouter';
import graphqlRouter from '@graphql/graphqlRouter';
import tmdbRouter from '@tmdb/tmdbRouter';

const PORT = process.env.PORT || 8080;

const app = express();

// Custom error handler middleware
// We need to provide all 4 arguments or the next object will be interpreted as regular middleware
// and fail to handle errors:
// https://github.com/visionmedia/supertest/issues/416#issuecomment-514508137
const errorHandlerMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction,
) => {
  console.error(err.stack);
  res.status(500).send({
    data: null,
    errors: [{ message: 'Server Error: Something broke!' }],
  });
};

const initMiddlewareAndRoutes = (expressApp: Application) => {
  // Configure CORS
  expressApp.use(
    cors({
      origin: [
        /http(s)?:\/\/(.+\.)?localhost(:\d{1,5})?$/,
        'https://restflix.netlify.app',
        'https://studio.apollographql.com',
      ],
      credentials: true,
    }),
  );

  // Remove the X-Powered-By headers
  expressApp.disable('x-powered-by');

  // Enable body-parser
  expressApp.use(express.json());

  // Enable cookie-parser
  expressApp.use(cookieParser());

  // Enable Authentication and Authorization for REST API routes
  expressApp.use(authRouter);

  // Enable Logger
  if (process.env.NODE_ENV === 'production') {
    expressApp.use(morgan('dev'));
  }

  // Show documentation on root
  expressApp.get('/', (req: Request, res: Response) => {
    res.redirect('/documentation.html');
  });

  // API routes
  expressApp.use(moviesRouter);
  expressApp.use(usersRouter);

  // TMDB API route
  expressApp.use(tmdbRouter);

  // GraphQL route
  expressApp.use(graphqlRouter);

  // Serve static files
  expressApp.use(express.static('public'));

  // Serve static files
  expressApp.use('/docs', express.static('out'));

  // Handle errors
  expressApp.use(errorHandlerMiddleware);
};

initMiddlewareAndRoutes(app);

app.listen(PORT, () => {
  console.info(
    `\nExpress server running in ${process.env.NODE_ENV || 'development'} mode`,
  );
  console.info(`Local:            http://localhost:${PORT}/`);
  console.info(`On Your Network:  http://${ip.address()}:${PORT}/\n`);
});
