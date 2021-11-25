import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import {
  calculateExpirationDate,
  generateJWTToken,
  generateRefreshTokenData,
  getRefreshTokenData,
  isValidRefreshToken,
  isOverHalfExpired,
  JWT_TOKEN_EXPIRATION_IN_SECONDS,
  removeRefreshTokenData,
  storeRefreshTokenData,
  REFRESH_TOKEN_EXPIRATION_IN_SECONDS,
} from '@utils/jwt';

import usersService from '@users/usersService';

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
    const userId = user._id.toString();

    const jwtToken = generateJWTToken(userId);
    const refreshTokenData = generateRefreshTokenData(userId);

    res.cookie('refreshToken', refreshTokenData.refreshToken, {
      maxAge: JWT_TOKEN_EXPIRATION_IN_SECONDS * 1000,
      httpOnly: true,
      secure: false,
    });

    const jwtTokenExpiration = calculateExpirationDate(
      JWT_TOKEN_EXPIRATION_IN_SECONDS,
    );

    storeRefreshTokenData(refreshTokenData);

    return res.send({
      data: { user, jwtToken, jwtTokenExpiration, refreshTokenData },
      errors: [],
    });
  })(req, res);
};

const loginUserSilently = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  if (isValidRefreshToken(refreshToken)) {
    const { userId } = getRefreshTokenData(refreshToken);

    const user = await usersService.findById(userId);

    removeRefreshTokenData(refreshToken);

    if (!user) {
      res.cookie('refreshToken', '', {
        expires: new Date(0),
        httpOnly: true,
        secure: false,
      });

      return res.status(401).send({
        data: null,
        errors: [{ message: 'Silent Login Error: User does not exist.' }],
      });
    }

    const newRefreshTokenData = generateRefreshTokenData(userId);

    storeRefreshTokenData(newRefreshTokenData);

    const jwtToken = generateJWTToken(userId);

    const jwtTokenExpiration = calculateExpirationDate(
      JWT_TOKEN_EXPIRATION_IN_SECONDS,
    );

    res.cookie('refreshToken', newRefreshTokenData.refreshToken, {
      maxAge: REFRESH_TOKEN_EXPIRATION_IN_SECONDS * 1000,
      httpOnly: true,
      secure: false,
    });

    return res.send({
      data: {
        jwtToken,
        jwtTokenExpiration,
        refreshTokenData: newRefreshTokenData,
        user,
      },
      errors: [],
    });
  }

  return res.status(400).send({
    data: null,
    errors: [
      { message: 'Authentication error: Invalid or expired refresh token.' },
    ],
  });
};

const logoutUser = (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;

  removeRefreshTokenData(refreshToken);

  res.cookie('refreshToken', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: false,
  });

  return res.send({
    data: null,
    errors: [],
  });
};

const tokenRefresh = (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const jwtToken = req?.headers?.authorization?.slice?.(7);

  if (isOverHalfExpired(jwtToken || '') && isValidRefreshToken(refreshToken)) {
    const { userId } = getRefreshTokenData(refreshToken);

    removeRefreshTokenData(refreshToken);

    const newRefreshTokenData = generateRefreshTokenData(userId);

    storeRefreshTokenData(newRefreshTokenData);

    const newJwtToken = generateJWTToken(userId);
    res.cookie('refreshToken', newRefreshTokenData.refreshToken, {
      maxAge: REFRESH_TOKEN_EXPIRATION_IN_SECONDS * 1000,
      httpOnly: true,
      secure: false,
    });

    return res.send({
      data: {
        jwtToken: newJwtToken,
        refreshTokenData: newRefreshTokenData,
      },
      errors: [],
    });
  }
  return res.status(400).send({
    data: null,
    errors: [
      { message: 'Authentication error: Invalid or expired refresh token.' },
    ],
  });
};

const requireJWTAuth = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
    if (err) {
      // Pass server errors to error handler middleware
      return next(err);
    }

    if (!user) {
      // If we have no user, we encountered a JWT Error such as 'no auth token'

      return res.status(401).send({
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
  loginUserSilently,
  logoutUser,
  tokenRefresh,
};
