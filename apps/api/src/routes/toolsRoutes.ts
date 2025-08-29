// src/routes/exampleRoutes.ts
import { Router } from 'express';
import {
  createTool,
  getTools,
  updateTool,
} from '../controllers/toolsController';

const router = Router();

router.get('/tools', getTools);
router.post('/tools', createTool);
router.put('/tools/:id', updateTool);

export default router;
