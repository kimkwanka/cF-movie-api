const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const { Strategy: JWTStrategy, ExtractJwt: ExtractJWT } = require('passport-jwt');

const Users = require('../users/usersModel');

const initLocalStrategy = () => {
  passport.use(new LocalStrategy({
    usernameField: 'Username',
    passwordField: 'Password',
  }, (username, password, callback) => {
    console.log(username, password);
    Users.findOne({ Username: username }, (err, user) => {
      if (err) {
        console.error(err);
        return callback(err);
      }

      if (!user) {
        console.log('incorrect username');
        return callback(null, false, { message: 'Incorrect username or password.' });
      }
      console.log('finished');
      return callback(null, user);
    });
  }));
};

const initJWTStrategy = async () => {
  const jwtStrategy = new JWTStrategy({
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET,
  }, (jwtPayload, callback) => Users.findById(jwtPayload._id)
    .then((user) => callback(null, user))
    .catch((error) => callback(error)));
  passport.use(jwtStrategy);
};

const initStrategies = () => {
  initLocalStrategy();
  initJWTStrategy();
};

module.exports = {
  initStrategies,
};
