import fetch from 'node-fetch';
import jwt from 'jsonwebtoken';

import { User } from './types';
import usersService from '../users/usersService';

const TMDB_BASE_API_URL = 'https://api.themoviedb.org/3';

export type TAuthorizedRequest = Request & {
  headers: { authorization: string };
};

export const authorizedFetch = async (apiEndpoint: string) => {
  try {
    const response = await fetch(`${TMDB_BASE_API_URL}${apiEndpoint}`, {
      headers: { Authorization: `Bearer ${process.env.TMDB_API_TOKEN}` },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

export const generateJWTToken = (user: User) =>
  jwt.sign({ userId: user._id }, process.env.JWT_SECRET as jwt.Secret, {
    subject: user.username,
    expiresIn: '7d',
    algorithm: 'HS256',
  });

type TJWTUserPayload = jwt.JwtPayload & { userId: string };

export const getAuthStatus = async (req: TAuthorizedRequest) => {
  try {
    const token = req?.headers?.authorization?.slice?.(7);

    if (!token) {
      return {
        userId: '',
        validToken: false,
        errors: [
          {
            message: "Authentication Error: Access token couldn't be found.",
          },
        ],
      };
    }

    const { userId } = jwt.verify(
      token,
      process.env.JWT_SECRET as jwt.Secret,
    ) as TJWTUserPayload;

    const user = await usersService.findById(userId);

    if (!user) {
      return {
        userId,
        validToken: false,
        errors: [
          {
            message: `User with id '${userId}' couldn't be found.`,
          },
        ],
      };
    }

    return {
      userId,
      validToken: true,
      errors: [],
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : err;

    console.error(errorMessage);
    return {
      userId: '',
      validToken: false,
      errors: [{ message: errorMessage as string }],
    };
  }
};

export const authenticateOperation = async <T>(
  authStatus: {
    userId: string;
    validToken: boolean;
    errors: Array<{ message: string }>;
  },
  targetUserId: string,
  operation: () => Promise<{
    statusCode: number;
    data: T | null;
    errors: Array<{ message: string }>;
  }>,
) => {
  const { userId, validToken, errors: authErrors } = authStatus;

  if (!validToken || userId !== targetUserId) {
    return {
      statusCode: 401,
      data: null,
      errors: authErrors.length
        ? authErrors
        : [
            {
              message: `Unauthorized: Not allowed to access user with id '${targetUserId}'`,
            },
          ],
    };
  }

  const { statusCode, data, errors } = await operation();
  return { statusCode, data, errors };
};
