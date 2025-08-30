import { Router } from 'express';
import { getAlertCount } from '../controllers/alertsController';

const router = Router();

router.get('/alerts/count', getAlertCount);

export default router;
