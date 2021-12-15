import { getTokenPayload, isValidToken } from '@auth/auth.service';

import usersService from '@users/users.service';

export const getAuthStatus = async (token: string) => {
  try {
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

    const { sub: userId } = getTokenPayload(token);

    const user = await usersService.findById(userId);

    if (!user) {
      return {
        userId,
        validToken: false,
        errors: [
          {
            message: `Authentication Error: User with id '${userId}' couldn't be found.`,
          },
        ],
      };
    }

    if (!isValidToken(token, user.passwordHash + process.env.JWT_SECRET)) {
      return {
        userId: '',
        validToken: false,
        errors: [
          {
            message: 'Authentication Error: No valid access token.',
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

type TRunIfAuthenticatedParams<T> = {
  authStatus: {
    userId: string;
    validToken: boolean;
    errors: Array<{ message: string }>;
  };
  operation: () =>
    | Promise<{
        statusCode: number;
        data: T | null;
        errors: Array<{ message: string }>;
      }>
    | Promise<T>;
};

type TRunIfAuthorizedParams<T> = TRunIfAuthenticatedParams<T> & {
  targetUserId: string;
};

export const runIfAuthenticated = async <T>({
  authStatus,
  operation,
}: TRunIfAuthenticatedParams<T>) => {
  const { validToken, errors: authErrors } = authStatus;

  if (!validToken) {
    return {
      statusCode: 401,
      data: null,
      errors: authErrors,
    };
  }
  const opResult = await operation();

  if ('statusCode' in opResult) {
    const { statusCode, data, errors } = opResult;

    return { statusCode, data, errors };
  }

  return { statusCode: 200, data: opResult, errors: [] };
};

export const runIfAuthorized = async <T>({
  authStatus,
  operation,
  targetUserId,
}: TRunIfAuthorizedParams<T>) => {
  const { validToken, userId, errors: authErrors } = authStatus;

  if (!validToken) {
    return {
      statusCode: 401,
      data: null,
      errors: authErrors,
    };
  }

  if (userId !== targetUserId) {
    return {
      statusCode: 401,
      data: null,
      errors: [
        {
          message: `Unauthorized: Not allowed to access user with id '${targetUserId}'`,
        },
      ],
    };
  }

  const opResult = await operation();

  if ('statusCode' in opResult) {
    const { statusCode, data, errors } = opResult;

    return { statusCode, data, errors };
  }

  return { statusCode: 200, data: opResult, errors: [] };
};
