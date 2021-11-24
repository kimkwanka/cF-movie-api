import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { RefreshTokenData } from '@generated/types';

export const JWT_TOKEN_EXPIRATION_IN_SECONDS = 5;
export const REFRESH_TOKEN_EXPIRATION_IN_SECONDS = 20;

type TJWTUserPayload = jwt.JwtPayload & { userId: string };
type TRefreshTokenList = Record<string, RefreshTokenData>;

const refreshTokenList: TRefreshTokenList = {};

export const generateJWTToken = (userId: string) =>
  jwt.sign({}, process.env.JWT_SECRET as jwt.Secret, {
    issuer: 'MOVIE_API',
    subject: userId,
    expiresIn: JWT_TOKEN_EXPIRATION_IN_SECONDS,
    algorithm: 'HS256',
  });

export const calculateExpirationDate = (durationInSeconds: number) => {
  return new Date(Date.now() + durationInSeconds * 1000);
};

export const getTokenPayload = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as TJWTUserPayload;

export const generateRefreshTokenData = (userId: string) => {
  const refreshToken = uuidv4();

  return {
    refreshToken,
    userId,
    expiresAt: calculateExpirationDate(REFRESH_TOKEN_EXPIRATION_IN_SECONDS),
  };
};

export const storeRefreshTokenData = (refreshTokenData: RefreshTokenData) => {
  refreshTokenList[refreshTokenData.refreshToken] = refreshTokenData;
};

export const removeRefreshTokenData = (refreshToken: string) => {
  delete refreshTokenList[refreshToken];
};

export const getRefreshTokenData = (refreshToken: string) => {
  return refreshTokenList[refreshToken];
};

export const isValidRefreshToken = (refreshToken: string) => {
  const refreshTokenData = refreshTokenList[refreshToken];
  if (!refreshTokenData) {
    return false;
  }
  const isNotExpired = new Date(Date.now()) <= refreshTokenData.expiresAt;
  return isNotExpired;
};

export const isOverHalfExpired = (jwtToken: string) => {
  let payload;

  try {
    payload = jwt.verify(
      jwtToken,
      process.env.JWT_SECRET as jwt.Secret,
    ) as TJWTUserPayload;
  } catch (error) {
    // JWT token is expired
    return true;
  }

  const exp = payload.exp || 0;
  const now = Date.now() / 1000;

  return exp - now <= JWT_TOKEN_EXPIRATION_IN_SECONDS / 2;
};
