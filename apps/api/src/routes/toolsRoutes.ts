import express, { Router } from 'express';
import {
  getToolById,
  getTools,
  newTool,
  setTool,
} from '../controllers/toolsController';

const router = Router();
router.use(express.json());

router.get('/tools/:id', getToolById);
router.get('/tools', getTools);
router.post('/tools', newTool);
router.put('/tools/:id', setTool);

export default router;
