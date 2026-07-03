import { Router } from 'express';
import {
    createFarm,
    getAllFarms,
    getFarmById,
    updateFarm,
    deleteFarm,
} from '../controllers/farm.controller';
import { authenticate } from '../middlewares/auth.middleware';

const router = Router();

router.post('/', authenticate, createFarm);
router.get('/', authenticate, getAllFarms);
router.get('/:id', authenticate, getFarmById);
router.patch('/:id', authenticate, updateFarm);
router.delete('/:id', authenticate, deleteFarm);

export default router;
