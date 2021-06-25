const express = require('express');

const jwtSecret = process.env.JWT_SECRET;

const jwt = require('jsonwebtoken');
const passport = require('passport');

const authRouter = express.Router();

const passportStrategies = require('./passportStrategies'); // Your local passport file

passportStrategies.initStrategies();

const generateJWTToken = (user) => jwt.sign(user, jwtSecret, {
  subject: user.Username, // This is the username you’re encoding in the JWT
  expiresIn: '7d', // This specifies that the token will expire in 7 days
  algorithm: 'HS256', // This is the algorithm used to “sign” or encode the values of the JWT
});

authRouter.post('/login', (req, res) => {
  passport.authenticate('local', { session: false }, (authError, user, _) => {
    if (authError || !user) {
      return res.status(400).json({
        message: 'Something is not right',
        user,
      });
    }
    req.login(user, { session: false }, (loginError) => {
      if (loginError) {
        res.send(loginError);
      }
      const token = generateJWTToken(user.toJSON());
      return res.json({ user, token });
    });
  })(req, res);
});

module.exports = authRouter;
