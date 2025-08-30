import { Router } from 'express';
import { getCodes } from '../controllers/codesController';

const router = Router();

router.get('/codes', getCodes);

export default router;
