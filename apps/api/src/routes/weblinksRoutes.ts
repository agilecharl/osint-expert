import express, { Router } from 'express';
import { getWeblinks } from '../controllers/weblinksController';

const router = Router();
router.use(express.json());

router.get('/weblinks', getWeblinks);

export default router;
