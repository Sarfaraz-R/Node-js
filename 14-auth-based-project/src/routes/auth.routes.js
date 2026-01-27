import express from 'express';
import handleRegistration from '../controllers/user-registration.controller.js';
import handleLogin from '../controllers/login-controller.js';
import handleRefresh from '../controllers/refresh.controller.js';
import handleLogout from '../controllers/logout.controller.js';
const route = express.Router();

route.post('/register',handleRegistration);
route.post('/login',handleLogin);
route.post('/refresh',handleRefresh);
route.post('/logout',handleLogout);

export default route;
