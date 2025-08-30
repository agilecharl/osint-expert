import { Router } from 'express';
import { getMessageCount } from '../controllers/generalController';

const router = Router();

router.get('/general/count', getMessageCount);

export default router;
