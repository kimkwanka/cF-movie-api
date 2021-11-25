import express from 'express';

import authController from '@auth/authController';

const authRouter = express.Router();

authRouter.post('/login', authController.loginUser);
authRouter.post('/logout', authController.logoutUser);
authRouter.post('/silentlogin', authController.loginUserSilently);
authRouter.post('/tokenrefresh', authController.tokenRefresh);

export default authRouter;
