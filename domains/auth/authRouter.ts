import express from 'express';

import authController from '@auth/authController';

const authRouter = express.Router();

authRouter.post('/login', authController.loginUser);

export default authRouter;
