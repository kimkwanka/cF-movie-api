const moviesService = require('./moviesService');

const getAllMovies = async (req, res) => res.send(await moviesService.findAllMovies());

const getMovieByTitle = async (req, res) => {
  const movieTitleToFind = req.params.title;
  const findMovieByTitleResponse = await moviesService.findMovieByTitle(movieTitleToFind);

  return res.status(findMovieByTitleResponse.statusCode).send(findMovieByTitleResponse.body);
};

const getGenreByName = async (req, res) => {
  const genreNameToFind = req.params.name;
  const findGenreByNameResponse = await moviesService.findGenreByName(genreNameToFind);

  return res.status(findGenreByNameResponse.statusCode).send(findGenreByNameResponse.body);
};

const getDirectorByName = async (req, res) => {
  const directorNameToFind = req.params.name;
  const findDirectorByNameResponse = await moviesService.findDirectorByName(directorNameToFind);

  return res.status(findDirectorByNameResponse.statusCode).send(findDirectorByNameResponse.body);
};

module.exports = {
  getAllMovies,
  getMovieByTitle,
  getGenreByName,
  getDirectorByName,
};
