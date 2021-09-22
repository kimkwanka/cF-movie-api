const express = require('express');
const jwt = require('jsonwebtoken');
const passport = require('passport');

const authRouter = express.Router();

const passportStrategies = require('./passportStrategies');

passportStrategies.initStrategies();

const generateJWTToken = (user) => jwt.sign(user, process.env.JWT_SECRET, {
  subject: user.username,
  expiresIn: '7d',
  algorithm: 'HS256',
});

const promisifiedAuthenticate = (req, res) => new Promise((resolve, reject) => {
  passport.authenticate('local', { session: false }, (err, user, info) => {
    if (err) {
      reject(err);
    }
    resolve({ user, info });
  })(req, res);
});

authRouter.post('/login', async (req, res) => {
  try {
    const { user, info } = await promisifiedAuthenticate(req, res);

    if (!user) {
      return res.status(400).send(info.message);
    }

    return req.login(user, { session: false }, (loginError) => {
      if (loginError) {
        return res.status(500).send(loginError);
      }
      const token = generateJWTToken(user.toJSON());
      return res.json({ user, token });
    });
  } catch (err) {
    console.error(err);
    return res.status(500).send(err.message);
  }
});

module.exports = authRouter;
