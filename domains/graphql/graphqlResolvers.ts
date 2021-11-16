import fetch from 'node-fetch';

import { Resolvers } from './types';

import moviesService from '../movies/moviesService';
import usersService from '../users/usersService';

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

const resolvers: Resolvers = {
  Query: {
    movies: async () => {
      const movies = await moviesService.findAllMovies();
      return movies;
    },
    discover: async (
      parent,
      args,
      context: { tmdbConfiguration: object | undefined },
    ) => {
      if (!context.tmdbConfiguration) {
        context.tmdbConfiguration = (
          await authorizedFetch('/configuration')
        ).images;
      }

      return (await authorizedFetch('/discover/movie')).results;
    },
    movie: async (parent, { id }) => authorizedFetch(`/movie/${id}`),
    users: async () => {
      const users = await usersService.findAllUsers();
      return users;
    },
  },
};

export default resolvers;
