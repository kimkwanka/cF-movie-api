import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import {
  Strategy as JWTStrategy,
  ExtractJwt as ExtractJWT,
} from 'passport-jwt';

import Users from '../users/usersModel';

const initLocalStrategy = () => {
  const localStrategy = new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const user = await Users.findOne({ username });
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
    },
  );

  passport.use(localStrategy);
};

const initJWTStrategy = () => {
  const jwtStrategy = new JWTStrategy(
    {
      jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await Users.findById(jwtPayload._id);

        return done(null, user);
      } catch (err) {
        console.error(err);
        return done(err);
      }
    },
  );

  passport.use(jwtStrategy);
};

const initStrategies = () => {
  initLocalStrategy();
  initJWTStrategy();
};

export default initStrategies;
