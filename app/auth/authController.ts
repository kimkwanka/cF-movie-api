import { Request, Response, NextFunction } from 'express';
import passport from 'passport';

import { TUserDocument } from '@users/usersModel';

import {
  addAccessTokenToBlacklist,
  addRefreshTokenToWhitelist,
  calculateExpirationDate,
  generateJWTToken,
  generateRefreshTokenData,
  getRefreshTokenData,
  getTokenPayload,
  isBlacklistedAccessToken,
  JWT_TOKEN_EXPIRATION_IN_SECONDS,
  REFRESH_TOKEN_EXPIRATION_IN_SECONDS,
  removeRefreshTokenFromWhitelist,
} from '@utils/jwt';

import usersService from '@users/usersService';

import initStrategies from './passportStrategies';

initStrategies();

const loginUser = (req: Request, res: Response, next: NextFunction) => {
  passport.authenticate(
    'local',
    { session: false },
    async (err, user: TUserDocument, info) => {
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

      const jwtToken = generateJWTToken({
        userId: user._id.toString(),
        passwordHash: user.passwordHash,
      });
      const refreshTokenData = generateRefreshTokenData({
        userId: user._id.toString(),
        passwordHash: user.passwordHash,
      });

      res.cookie('refreshToken', refreshTokenData.refreshToken, {
        maxAge: REFRESH_TOKEN_EXPIRATION_IN_SECONDS * 1000,
        httpOnly: true,
        secure: true,
        sameSite: 'none',
      });

      const jwtTokenExpiration = calculateExpirationDate(
        JWT_TOKEN_EXPIRATION_IN_SECONDS,
      );

      await addRefreshTokenToWhitelist(refreshTokenData);

      return res.send({
        data: { user, jwtToken, jwtTokenExpiration, refreshTokenData },
        errors: [],
      });
    },
  )(req, res);
};

export const refreshAllTokens = async (req: Request) => {
  const { refreshToken }: { refreshToken: string } = req.cookies;

  const refreshTokenData = await getRefreshTokenData(refreshToken);

  const user = refreshTokenData
    ? await usersService.findById(refreshTokenData.userId)
    : null;

  await removeRefreshTokenFromWhitelist(refreshToken);

  if (user) {
    const newJwtToken = generateJWTToken({
      userId: user._id.toString(),
      passwordHash: user.passwordHash,
    });

    const newRefreshTokenData = generateRefreshTokenData({
      userId: user._id.toString(),
      passwordHash: user.passwordHash,
    });

    await addRefreshTokenToWhitelist(newRefreshTokenData);

    return {
      jwtToken: newJwtToken,
      refreshTokenData: newRefreshTokenData,
      user,
    };
  }

  return {};
};

const silentRefresh = async (req: Request, res: Response) => {
  const { user, jwtToken, refreshTokenData } = await refreshAllTokens(req);

  if (!refreshTokenData) {
    res.cookie('refreshToken', '', {
      expires: new Date(0),
      httpOnly: true,
      secure: true,
      sameSite: 'none',
    });

    return res.status(400).send({
      data: null,
      errors: [{ message: 'Authentication Error: Invalid refresh token.' }],
    });
  }

  res.cookie('refreshToken', refreshTokenData.refreshToken, {
    maxAge: REFRESH_TOKEN_EXPIRATION_IN_SECONDS * 1000,
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  return res.send({
    data: {
      jwtToken,
      refreshTokenData,
      user,
    },
    errors: [],
  });
};

const logoutUser = async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  const jwtToken = req?.headers?.authorization?.slice?.(7);

  await addAccessTokenToBlacklist(jwtToken);
  await removeRefreshTokenFromWhitelist(refreshToken);

  res.cookie('refreshToken', '', {
    expires: new Date(0),
    httpOnly: true,
    secure: true,
    sameSite: 'none',
  });

  return res.send({
    data: null,
    errors: [],
  });
};

const requireAuthentication = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    if (err) {
      // Pass server errors to error handler middleware
      return next(err);
    }

    const jwtToken = req?.headers?.authorization?.slice?.(7);

    if (!user) {
      // If we have no user, we encountered a JWT Error such as 'no auth token'

      return res.status(401).send({
        errors: [{ message: `JWT Error: ${info.message}` }],
        data: null,
      });
    }

    if (await isBlacklistedAccessToken(jwtToken)) {
      return res.status(401).send({
        errors: [{ message: `JWT Error: Blacklisted.` }],
        data: null,
      });
    }

    return next();
  })(req, res);
};

const requireAuthorization = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const requestUserId = req.params.userId;

  const token = req?.headers?.authorization?.slice?.(7);

  if (!token) {
    return res.status(400).send({
      data: null,
      errors: {
        message: "Authentication Error: Access token couldn't be found.",
      },
    });
  }

  const { sub: userId } = getTokenPayload(token);

  if (requestUserId !== userId) {
    return res.status(401).send({
      data: null,
      errors: {
        message: `Unauthorized: Not allowed to access user with id '${requestUserId}'`,
      },
    });
  }

  return next();
};

export default {
  loginUser,
  requireAuthentication,
  requireAuthorization,
  silentRefresh,
  logoutUser,
};
