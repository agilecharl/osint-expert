import express, { Router } from 'express';
import { getAlertCount } from '../controllers/alertsController';

const router = Router();
router.use(express.json());

router.get('/alerts/count', getAlertCount);

export default router;
