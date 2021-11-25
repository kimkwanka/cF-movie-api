import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import { Tedis } from 'tedis';

import { RefreshTokenData } from '@generated/types';

export const JWT_TOKEN_EXPIRATION_IN_SECONDS = 15 * 60;
export const REFRESH_TOKEN_EXPIRATION_IN_SECONDS = 24 * 60 * 60;

type TJWTUserPayload = jwt.JwtPayload & { userId: string };

const redis = new Tedis({
  password: 'TEDIS_PASS',
});

export const generateJWTToken = (userId: string) =>
  jwt.sign({}, process.env.JWT_SECRET as jwt.Secret, {
    issuer: 'MOVIE_API',
    subject: userId,
    expiresIn: JWT_TOKEN_EXPIRATION_IN_SECONDS,
    algorithm: 'HS256',
  });

export const calculateExpirationDate = (expirationInSeconds: number) => {
  return new Date(Date.now() + expirationInSeconds * 1000);
};

export const calculateRemainingExpirationInSeconds = (expirationDate: Date) => {
  return Math.floor((new Date(expirationDate).getTime() - Date.now()) / 1000);
};

export const getTokenPayload = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as TJWTUserPayload;

export const generateRefreshTokenData = (userId: string, jwtToken: string) => {
  const refreshToken = uuidv4();

  return {
    refreshToken,
    jwtToken,
    userId,
    expiresAt: calculateExpirationDate(REFRESH_TOKEN_EXPIRATION_IN_SECONDS),
  };
};

export const addAccessTokenToBlacklist = async (
  jwtToken: string | undefined,
) => {
  try {
    if (!jwtToken) {
      return 0;
    }
    const { exp } = jwt.verify(jwtToken, process.env.JWT_SECRET as jwt.Secret, {
      ignoreExpiration: true,
    }) as TJWTUserPayload;

    await redis.set(`ACCESS_TOKEN_BLACKLIST${jwtToken}`, jwtToken);

    if (exp) {
      await redis.expireat(`ACCESS_TOKEN_BLACKLIST${jwtToken}`, exp);
    }

    return 1;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const isBlacklistedAccessToken = async (
  jwtToken: string | undefined,
) => {
  if (!jwtToken) {
    return true;
  }

  try {
    const blacklistedToken = await redis.get(
      `ACCESS_TOKEN_BLACKLIST${jwtToken}`,
    );
    return !!blacklistedToken;
  } catch (error) {
    console.error(error);
    return true;
  }
};

export const addRefreshTokenToWhitelist = async (
  refreshTokenData: RefreshTokenData,
) => {
  try {
    // Add refresh token key to whitelist and set key expiration time to remaining TTL for the token plus 10s leeway
    // to account for the time needed to grab refresh token's data.
    return await redis.setex(
      `REFRESH_TOKEN_WHITELIST${refreshTokenData.refreshToken}`,
      calculateRemainingExpirationInSeconds(refreshTokenData.expiresAt) + 10,
      JSON.stringify(refreshTokenData),
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const removeRefreshTokenFromWhitelist = async (refreshToken: string) => {
  try {
    if (!refreshToken) {
      return 0;
    }
    return await redis.del(`REFRESH_TOKEN_WHITELIST${refreshToken}`);
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const getRefreshTokenData = async (refreshToken: string) => {
  try {
    const refreshTokenDataString = (await redis.get(
      `REFRESH_TOKEN_WHITELIST${refreshToken}`,
    )) as string;
    return JSON.parse(refreshTokenDataString) as RefreshTokenData;
  } catch (error) {
    console.error(error);
    return null;
  }
};

export const isValidRefreshToken = async (refreshToken: string) => {
  if (!refreshToken) {
    return false;
  }
  // Since we let the refresh token keys in Redis expire when the refresh token would expire, we need to
  // only check if the refresh token key still exists in our whitelist.
  const refreshTokenData = await redis.get(
    `REFRESH_TOKEN_WHITELIST${refreshToken}`,
  );

  // Coerce into boolean
  return !!refreshTokenData;
};
