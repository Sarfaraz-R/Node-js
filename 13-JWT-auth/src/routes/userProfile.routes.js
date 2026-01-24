import userProfile from "../controllers/userProfile.js";

import express from 'express';

const router=express.Router();

router.get('/',userProfile);

export default router;