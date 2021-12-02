import { Request, Response } from 'express';

import { tmdbFetch } from '@utils/tmdb';

const tmdbQuery = async (req: Request, res: Response) => {
  const endpoint = req.originalUrl.replace('/tmdb', '');

  try {
    const data = await tmdbFetch(endpoint);

    return res.send({
      data,
      errors: [],
    });
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : err;

    console.error(errorMessage);
    return {
      data: null,
      errors: [{ message: errorMessage as string }],
    };
  }
};

export default {
  tmdbQuery,
};
