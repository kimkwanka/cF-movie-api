import passport from 'passport';
import { Strategy as LocalStrategy } from 'passport-local';

import {
  Strategy as JWTStrategy,
  ExtractJwt as ExtractJWT,
} from 'passport-jwt';

import usersService from '../users/usersService';

const initLocalStrategy = () => {
  const localStrategy = new LocalStrategy(
    {
      usernameField: 'username',
      passwordField: 'password',
    },
    async (username, password, done) => {
      try {
        const { data, errors } = await usersService.loginUser({
          username,
          password,
        });

        if (errors.length) {
          return done(null, false, errors[0]);
        }

        return done(null, data);
      } catch (err) {
        console.error(err);
        return { message: err };
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
        const user = await usersService.findById(jwtPayload._id);

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
