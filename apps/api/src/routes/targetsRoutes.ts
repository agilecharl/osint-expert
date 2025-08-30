import { Router } from 'express';
import { getTargets } from '../controllers/targetsControllers';

const router = Router();

router.get('/targets', getTargets);

export default router;
