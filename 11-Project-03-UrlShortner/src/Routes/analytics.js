import express from 'express'
import getAnalytics from '../Controllers/getAnalytics.js'
const router =express.Router();

router.get('/:id',getAnalytics);
export default router;