import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { generateJWTToken, generateRefreshToken } from '@utils/jwt';
import initStrategies from './passportStrategies';

initStrategies();

const loginUser = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      // Pass server errors to error handler middleware
      return next(err);
    }

    if (!user) {
      // If we have no user, we encountered a Login Error such as 'bad credentials'

      // Even though we expect 'info' to have a 'message' property, passport strategies
      // sometimes put Error objects in 'info'. Despite having a 'message', their properties are not enumerable
      // and therefore can't be be send over directly with res.send().
      // So just to be safe, we extract the message and put it in manually instead of passing 'info' directly.

      return res.status(400).send({
        errors: [{ message: `Login error: ${info.message}` }],
        data: null,
      });
    }

    const jwtToken = generateJWTToken(user.toJSON());
    const refreshToken = generateRefreshToken(user.toJSON());

    return res.send({ data: { user, jwtToken, refreshToken }, errors: [] });
  })(req, res);
};

const requireJWTAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      // Pass server errors to error handler middleware
      return next(err);
    }

    if (!user) {
      // If we have no user, we encountered a JWT Error such as 'no auth token'

      return res.status(400).send({
        errors: [{ message: `JWT Error: ${info.message}` }],
        data: null,
      });
    }

    return next();
  })(req, res);
};

export default {
  loginUser,
  requireJWTAuth,
};
