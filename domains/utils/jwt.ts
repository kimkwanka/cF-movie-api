import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { User } from '@generated/types';

const JWT_TOKEN_EXPIRATION_IN_SECONDS = 60;
const REFRESH_TOKEN_EXPIRATION_IN_SECONDS = 120;

type TJWTUserPayload = jwt.JwtPayload & { userId: string };

export const generateJWTToken = (user: User) =>
  jwt.sign({ userId: user._id }, process.env.JWT_SECRET as jwt.Secret, {
    issuer: 'MOVIE_API',
    subject: user.username,
    expiresIn: JWT_TOKEN_EXPIRATION_IN_SECONDS,
    algorithm: 'HS256',
  });

export const getTokenPayload = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as TJWTUserPayload;

export const generateRefreshToken = (user: User) => {
  const refreshToken = uuidv4();

  return {
    refreshToken,
    userId: user._id || '',
    expiresAt: new Date(
      new Date().getTime() + REFRESH_TOKEN_EXPIRATION_IN_SECONDS * 1000,
    ),
  };
};
