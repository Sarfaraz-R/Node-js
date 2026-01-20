import express from 'express'
import createShortUrl from '../Controllers/createShortUrl.js';
import getAllShortenedUrls from '../Controllers/getAllShortenedUrls.js';
import redirect from '../Controllers/redirect.js';
import deleteShortCode from '../Controllers/deleteShortCode.js';

const router =express.Router();

router.post('/',createShortUrl);
router.get('/',getAllShortenedUrls)
router.get('/:id',redirect);
router.delete('/:id',deleteShortCode);

export default router;