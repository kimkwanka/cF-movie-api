const usersService = require('./usersService');

const addUser = async (req, res) => {
  try {
    const {
      Username, Password, Email, Birthday,
    } = req.body;

    const requestBodyValidationErrors = await usersService.validateRequestBody(req);

    if (!requestBodyValidationErrors.isEmpty()) {
      return res.status(422).json({ errors: requestBodyValidationErrors.array() });
    }

    const addUserResponse = await usersService.addUser({
      Username, Password, Email, Birthday,
    });

    return res.status(addUserResponse.statusCode).send(addUserResponse.body);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Error: ${error}`);
  }
};

const updateUser = async (req, res) => {
  try {
    const {
      Username, Password, Email, Birthday,
    } = req.body;

    const { user_id } = req.params;

    const updateUserResponse = await usersService.updateUser(user_id, {
      Username, Password, Email, Birthday,
    });

    return res.status(updateUserResponse.statusCode).send(updateUserResponse.body);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Error: ${error}`);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { user_id } = req.params;

    const deleteUserResponse = await usersService.deleteUser(user_id);

    return res.status(deleteUserResponse.statusCode).send(deleteUserResponse.body);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Error: ${error}`);
  }
};

const addFavoriteMovieToUser = async (req, res) => {
  try {
    const {
      user_id, movie_id,
    } = req.params;

    const addFavoriteMovieToUserResponse = await usersService.addFavoriteMovieToUser(user_id, movie_id);

    return res.status(addFavoriteMovieToUserResponse.statusCode).send(addFavoriteMovieToUserResponse.body);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Error: ${error}`);
  }
};

const removeFavoriteMovieFromUser = async (req, res) => {
  try {
    const {
      user_id, movie_id,
    } = req.params;

    const removeFavoriteMovieFromUserResponse = await usersService.removeFavoriteMovieFromUser(user_id, movie_id);

    return res.status(removeFavoriteMovieFromUserResponse.statusCode).send(removeFavoriteMovieFromUserResponse.body);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Error: ${error}`);
  }
};

module.exports = {
  addUser,
  updateUser,
  deleteUser,
  addFavoriteMovieToUser,
  removeFavoriteMovieFromUser,
};
