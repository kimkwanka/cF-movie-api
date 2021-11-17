import { Request, Response } from 'express';

import usersService from './usersService';

const getOperationResponse = async (
  res: Response,
  operation: () => Promise<{
    statusCode: number;
    data: object | null;
    errors: Array<{ message: string }>;
  }>,
) => {
  try {
    const { statusCode, data, errors } = await operation();

    return res.status(statusCode).send({ data, errors });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : err;

    console.error(errorMessage);
    return res
      .status(500)
      .send({ data: null, errors: [{ message: errorMessage as string }] });
  }
};

const addUser = async (req: Request, res: Response) => {
  const { username, password, email, birthday } = req.body;
  return getOperationResponse(res, async () =>
    usersService.addUser({
      username,
      password,
      email,
      birthday,
    }),
  );
};

const updateUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  const { username, email, birthday, password } = req.body;

  return getOperationResponse(res, async () =>
    usersService.updateUser(userId, {
      username,
      password,
      email,
      birthday,
    }),
  );
};

const deleteUser = async (req: Request, res: Response) => {
  const { userId } = req.params;

  return getOperationResponse(res, async () => usersService.deleteUser(userId));
};

const addFavoriteMovieToUser = async (req: Request, res: Response) => {
  const { userId, movieId } = req.params;

  return getOperationResponse(res, async () =>
    usersService.addFavoriteMovieToUser(userId, movieId),
  );
};

const removeFavoriteMovieFromUser = async (req: Request, res: Response) => {
  const { userId, movieId } = req.params;

  return getOperationResponse(res, async () =>
    usersService.removeFavoriteMovieFromUser(userId, movieId),
  );
};

export default {
  addUser,
  updateUser,
  deleteUser,
  addFavoriteMovieToUser,
  removeFavoriteMovieFromUser,
};
