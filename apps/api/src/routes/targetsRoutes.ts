import { Router } from 'express';
import { getTargetCount, getTargets } from '../controllers/targetsControllers';

const router = Router();

router.get('/targets', getTargets);
router.get('/targets/count', getTargetCount);

export default router;
