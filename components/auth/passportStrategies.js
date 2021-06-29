const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JWTStrategy, ExtractJwt: ExtractJWT } = require('passport-jwt');

const Users = require('../users/usersModel');

const initLocalStrategy = () => {
  const localStrategy = new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password',
  }, async (username, password, done) => {
    try {
      const user = await Users.findOne({ Username: username });
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }

      const passwordMatch = await user.validatePassword(password);
      if (!passwordMatch) {
        return done(null, false, { message: 'Incorrect password.' });
      }

      return done(null, user);
    } catch (err) {
      console.error(err);
      return done(err);
    }
  });

  passport.use(localStrategy);
};

const initJWTStrategy = () => {
  const jwtStrategy = new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  }, async (jwtPayload, done) => {
    try {
      const user = await Users.findById(jwtPayload._id);

      return done(null, user);
    } catch (err) {
      console.error(err);
      return done(err);
    }
  });

  passport.use(jwtStrategy);
};

const initStrategies = () => {
  initLocalStrategy();
  initJWTStrategy();
};

module.exports = {
  initStrategies,
};
