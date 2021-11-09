import { Request, Response } from 'express';

import moviesService from './moviesService';

const getAllMovies = async (req: Request, res: Response) =>
  res.send(await moviesService.findAllMovies());

const getMovieByTitle = async (req: Request, res: Response) => {
  const movieTitleToFind = req.params.title;
  const findMovieByTitleResponse = await moviesService.findMovieByTitle(
    movieTitleToFind,
  );

  return res
    .status(findMovieByTitleResponse.statusCode)
    .send(findMovieByTitleResponse.body);
};

const getGenreByName = async (req: Request, res: Response) => {
  const genreNameToFind = req.params.name;
  const findGenreByNameResponse = await moviesService.findGenreByName(
    genreNameToFind,
  );

  return res
    .status(findGenreByNameResponse.statusCode)
    .send(findGenreByNameResponse.body);
};

const getDirectorByName = async (req: Request, res: Response) => {
  const directorNameToFind = req.params.name;
  const findDirectorByNameResponse = await moviesService.findDirectorByName(
    directorNameToFind,
  );

  return res
    .status(findDirectorByNameResponse.statusCode)
    .send(findDirectorByNameResponse.body);
};

export default {
  getAllMovies,
  getMovieByTitle,
  getGenreByName,
  getDirectorByName,
};
