import express, { Router } from 'express';
import {
  createTool,
  getTools,
  updateTool,
} from '../controllers/toolsController';

const router = Router();
router.use(express.json());

router.get('/tools', getTools);
router.post('/tools', createTool);
router.put('/tools/:id', updateTool);

export default router;
