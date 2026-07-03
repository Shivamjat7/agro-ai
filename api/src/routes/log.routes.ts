import { Router } from 'express';
import { authenticate } from '../middlewares/auth.middleware';
import { upload } from '../middlewares/upload.middleware';
import { validate } from '../middlewares/validate.middleware';
import { createFertilizerLogSchema, createMedicineLogSchema } from '../validators/logs.validator';
import {
    createFertilizerLog,
    getFertilizerLogs,
    createMedicineLog,
    getMedicineLogs,
} from '../controllers/log.controller';

const router = Router();

// Sub-routes for a specific crop's logs
router.post(
    '/:cropId/fertilizer-logs',
    authenticate,
    upload.single('file'),
    validate(createFertilizerLogSchema),
    createFertilizerLog
);

router.get('/:cropId/fertilizer-logs', authenticate, getFertilizerLogs);

router.post(
    '/:cropId/medicine-logs',
    authenticate,
    upload.single('file'),
    validate(createMedicineLogSchema),
    createMedicineLog
);

router.get('/:cropId/medicine-logs', authenticate, getMedicineLogs);

export default router;
