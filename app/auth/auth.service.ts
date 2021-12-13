import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

import redis from '@auth/auth.redis';

import usersService from '@users/users.service';

import { RefreshTokenData } from '@generated/types';

export const JWT_TOKEN_EXPIRATION_IN_SECONDS = 15 * 60;
export const REFRESH_TOKEN_EXPIRATION_IN_SECONDS = 24 * 60 * 60;

type TJWTUserPayload = jwt.JwtPayload & {
  iat: number;
  exp: number;
  iss: string;
  sub: string;
};

export const generateJWTToken = ({
  userId,
  passwordHash,
}: {
  userId: string;
  passwordHash: string;
}) =>
  jwt.sign({}, (passwordHash + process.env.JWT_SECRET) as jwt.Secret, {
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
  jwt.decode(token) as TJWTUserPayload;

export const isValidToken = (token: string, secretOrPublicKey: string) => {
  try {
    const payload = jwt.verify(token, secretOrPublicKey) as TJWTUserPayload;

    return !!payload;
  } catch (error) {
    return false;
  }
};

export const generateRefreshTokenData = ({
  userId,
  passwordHash,
}: {
  userId: string;
  passwordHash: string;
}) => {
  const refreshToken = uuidv4();

  return {
    refreshToken,
    userId,
    passwordHash,
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
    const { exp } = getTokenPayload(jwtToken);

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
  if (!refreshToken) {
    return null;
  }
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

export const refreshAllTokens = async (refreshToken: string) => {
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

export { default as initStrategies } from '@auth/auth.strategies';
