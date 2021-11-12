import fetch from 'node-fetch';

import moviesService from '../movies/moviesService';

const TMDB_BASE_API_URL = 'https://api.themoviedb.org/3';

// TODO: Add try catch
const authorizedFetch = async (apiEndpoint: string) => {
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

const resolvers = {
  Query: {
    movies: async () => {
      const movies = await moviesService.findAllMovies();
      return movies;
    },
    discover: async (
      parent: undefined,
      args: undefined,
      context: { tmdbConfiguration: object | undefined },
    ) => {
      if (!context.tmdbConfiguration) {
        context.tmdbConfiguration = (
          await authorizedFetch('/configuration')
        ).images;
      }

      return (await authorizedFetch('/discover/movie')).results;
    },
    movie: ({ id }: { id: number }) => authorizedFetch(`/movie/${id}`),
  },
};

export default resolvers;
