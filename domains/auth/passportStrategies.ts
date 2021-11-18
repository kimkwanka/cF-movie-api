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

        // On login errors, pass first error as info message
        if (errors.length) {
          return done(null, null, errors[0]);
        }

        return done(null, data);
      } catch (serverError) {
        // Bubble up server errors
        return done(serverError);
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
    async ({ userId }, done) => {
      try {
        const user = await usersService.findById(userId);

        if (!user) {
          return done(null, null, {
            message: `Unauthorized: User couldn't be found.`,
          });
        }

        return done(null, user);
      } catch (serverError) {
        // Bubble up server errors
        return done(serverError);
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
