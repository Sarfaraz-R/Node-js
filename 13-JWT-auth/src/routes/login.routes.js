import handleLogin from "../controllers/login.controller.js";

import express from 'express';

const router=express.Router();

router.post('/',handleLogin);

export default router;