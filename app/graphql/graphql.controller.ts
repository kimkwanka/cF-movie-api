import { Request, Response, NextFunction } from 'express';

import apolloServer from '@graphql/graphql.server';

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
