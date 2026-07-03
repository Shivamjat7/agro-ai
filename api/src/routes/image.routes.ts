import { Router } from 'express';

import { authenticate } from '../middlewares/auth.middleware';

import { upload } from '../middlewares/upload.middleware';

import { getCropImages, getWeeklyLogImages, uploadImage } from '../controllers/image.controller';

const router = Router();

router.post('/', authenticate, upload.single('file'), uploadImage);

router.get('/crop/:cropId', authenticate, getCropImages);

router.get('/log/:weeklyLogId', authenticate, getWeeklyLogImages);
export default router;
