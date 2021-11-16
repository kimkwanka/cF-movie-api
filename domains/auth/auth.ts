import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import passport from 'passport';

import initStrategies from './passportStrategies';

import { IUserDocument } from '../users/usersModel';

const authRouter = express.Router();

initStrategies();

const generateJWTToken = (user: Partial<IUserDocument>) =>
  jwt.sign(user, process.env.JWT_SECRET as jwt.Secret, {
    subject: user.username,
    expiresIn: '7d',
    algorithm: 'HS256',
  });

const promisifiedAuthenticate = (req: Request, res: Response) =>
  new Promise((resolve, reject) => {
    passport.authenticate('local', { session: false }, (err, user, info) => {
      if (err) {
        reject(err);
      }
      resolve({ user, info });
    })(req, res);
  });

authRouter.post('/login', async (req, res) => {
  try {
    const { user, info } = (await promisifiedAuthenticate(req, res)) as {
      user: IUserDocument;
      info: { message: string };
    };

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
    const errorMessage = err instanceof Error ? err.message : err;

    console.error(errorMessage);
    return res.status(500).send(errorMessage);
  }
});

export default authRouter;
