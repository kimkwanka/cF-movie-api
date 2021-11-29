import fetch from 'node-fetch';

const TMDB_BASE_API_URL = 'https://api.themoviedb.org/3';

export const tmdbFetch = async (apiEndpoint: string) => {
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

export default { tmdbFetch };
