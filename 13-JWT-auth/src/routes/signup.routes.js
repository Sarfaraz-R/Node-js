import handleSignup from "../controllers/signup.controller.js";

import express from 'express';

const router=express.Router();

router.post('/',handleSignup);

export default router;