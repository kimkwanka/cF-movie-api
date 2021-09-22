const usersService = require('./usersService');

const addUser = async (req, res) => {
  try {
    const {
      username, password, email, birthday,
    } = req.body;

    const requestBodyValidationErrors = await usersService.validateAddUserRequestBody(req);

    if (!requestBodyValidationErrors.isEmpty()) {
      return res.status(422).json({ errors: requestBodyValidationErrors.array() });
    }

    const addUserResponse = await usersService.addUser({
      username, password, email, birthday,
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
      username, email, birthday,
    } = req.body;

    let { password } = req.body;

    if (!password) {
      password = req.user.password;
    }

    const requestBodyValidationErrors = await usersService.validateUpdateUserRequestBody(req);

    if (!requestBodyValidationErrors.isEmpty()) {
      return res.status(422).json({ errors: requestBodyValidationErrors.array() });
    }

    const { userId } = req.params;

    const updateUserResponse = await usersService.updateUser(userId, {
      username, password, email, birthday,
    });

    return res.status(updateUserResponse.statusCode).send(updateUserResponse.body);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Error: ${error}`);
  }
};

const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const deleteUserResponse = await usersService.deleteUser(userId);

    return res.status(deleteUserResponse.statusCode).send(deleteUserResponse.body);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Error: ${error}`);
  }
};

const addFavoriteMovieToUser = async (req, res) => {
  try {
    const {
      userId, movieId,
    } = req.params;

    const addFavoriteMovieToUserResponse = await usersService.addFavoriteMovieToUser(userId, movieId);

    return res.status(addFavoriteMovieToUserResponse.statusCode).send(addFavoriteMovieToUserResponse.body);
  } catch (error) {
    console.error(error);
    return res.status(500).send(`Error: ${error}`);
  }
};

const removeFavoriteMovieFromUser = async (req, res) => {
  try {
    const {
      userId, movieId,
    } = req.params;

    const removeFavoriteMovieFromUserResponse = await usersService.removeFavoriteMovieFromUser(userId, movieId);

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
