import { Router } from 'express';
import { getFindingCount } from '../controllers/findingsController';

const router = Router();

router.get('/findings/count', getFindingCount);

export default router;
