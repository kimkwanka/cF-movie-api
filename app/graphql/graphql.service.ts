import { getTokenPayload } from '@auth/auth.service';

import usersService from '@users/users.service';

export type TAuthorizedRequest = Request & {
  headers: { authorization: string };
};

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

    const { userId } = getTokenPayload(token);

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
