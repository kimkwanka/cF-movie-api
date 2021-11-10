import fetch from 'node-fetch';

import moviesService from '../movies/moviesService';

const TMDB_BASE_API_URL = 'https://api.themoviedb.org/3';

const authorizedFetch = async (apiEndpoint: string) => {
  const response = await fetch(`${TMDB_BASE_API_URL}${apiEndpoint}`, {
    headers: { Authorization: `Bearer ${process.env.TMDB_API_TOKEN}` },
  });
  const data = await response.json();
  return data;
};

const rootValue = {
  movies: async () => {
    const movies = await moviesService.findAllMovies();
    return movies;
  },
  configuration: async () => (await authorizedFetch('/configuration')).images,
  discover: async () => (await authorizedFetch('/discover/movie')).results,
  movie: ({ id }: { id: number }) => authorizedFetch(`/movie/${id}`),
};

export { rootValue };
export default { rootValue };
