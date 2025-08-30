import express, { Router } from 'express';
import { getCodes } from '../controllers/codesController';

const router = Router();
router.use(express.json());

router.get('/codes', getCodes);

export default router;
