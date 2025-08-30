import express, { Router } from 'express';
import { getMessageCount } from '../controllers/generalController';

const router = Router();
router.use(express.json());

router.get('/general/count', getMessageCount);

export default router;
