import express, { Router } from 'express';
import { getFindingCount } from '../controllers/findingsController';

const router = Router();
router.use(express.json());

router.get('/findings/count', getFindingCount);

export default router;
