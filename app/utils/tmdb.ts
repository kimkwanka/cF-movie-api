import fetch from 'node-fetch';

const TMDB_BASE_API_URL = 'https://api.themoviedb.org/3';

export const tmdbFetch = async (apiEndpoint: string) => {
  try {
    const response = await fetch(`${TMDB_BASE_API_URL}${apiEndpoint}`, {
      headers: { Authorization: `Bearer ${process.env.TMDB_API_TOKEN}` },
    });

    const resData = await response.json();

    if (response.ok) {
      return {
        statusCode: response.status,
        data: resData,
        errors: [],
      };
    }

    return {
      statusCode: response.status,
      data: null,
      errors: resData.errors.map((eMsg: string) => ({
        message: eMsg,
      })),
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : err;

    console.error(errorMessage);

    return {
      statusCode: 500,
      data: null,
      errors: [{ message: errorMessage as string }],
    };
  }
};

export default { tmdbFetch };
