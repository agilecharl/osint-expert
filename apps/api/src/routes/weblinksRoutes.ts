import { Router } from 'express';
import { getWeblinks } from '../controllers/weblinksController';

const router = Router();

router.get('/weblinks', getWeblinks);

export default router;
