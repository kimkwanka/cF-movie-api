import { Request, Response } from 'express';

import { tmdbFetch } from '@utils/tmdb';

const tmdbQuery = async (req: Request, res: Response) => {
  const endpoint = req.originalUrl.replace('/tmdb', '');

  try {
    const { data, errors, statusCode } = await tmdbFetch(endpoint);

    return res.status(statusCode).send({
      data,
      errors,
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : err;

    console.error(errorMessage);

    return res.status(500).send({
      data: null,
      errors: [{ message: errorMessage as string }],
    });
  }
};

export default {
  tmdbQuery,
};
