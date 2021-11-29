import express from 'express';

import authController from '@auth/authController';

const authRouter = express.Router();

authRouter.post('/login', authController.loginUser);
authRouter.post('/logout', authController.logoutUser);
authRouter.post('/silentrefresh', authController.silentRefresh);

export default authRouter;
