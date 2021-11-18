import jwt from 'jsonwebtoken';

import { User } from '@generated/types';

type TJWTUserPayload = jwt.JwtPayload & { userId: string };

export const generateToken = (user: User) =>
  jwt.sign({ userId: user._id }, process.env.JWT_SECRET as jwt.Secret, {
    subject: user.username,
    expiresIn: '7d',
    algorithm: 'HS256',
  });

export const getTokenPayload = (token: string) =>
  jwt.verify(token, process.env.JWT_SECRET as jwt.Secret) as TJWTUserPayload;
