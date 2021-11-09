import moviesService from '../movies/moviesService';

const rootValue = {
  movies: async () => {
    const movies = await moviesService.findAllMovies();
    return movies;
  },
};

export { rootValue };
export default { rootValue };
