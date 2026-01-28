import express from 'express';
import {
  changePassword,
  currentUser,
  loginUser,
  logoutUser,
  refreshAccessToken,
  registerUser,
} from '../controllers/auth.controllers.js';
import {
  loginValidation,
  registrationValidation,
} from '../validators/validations.js';
import { validate } from '../middlewares/validation.middlewares.js';
import { verifyJwt } from '../middlewares/auth.middleware.js';
const router = express.Router();

router
  .route('/register')
  .post(registrationValidation(), validate, registerUser);

router.route('/login').post(loginValidation(), validate, loginUser);

router.route('/logout').post(verifyJwt, logoutUser);

router.route('/current-user').get(verifyJwt, currentUser);

router.route('/refresh-token').post(verifyJwt, refreshAccessToken);

router.route('/change-password').post(verifyJwt,changePassword);

export default router;
