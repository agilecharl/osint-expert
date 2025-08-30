import { Router } from 'express';
import { getMessageCount } from '../controllers/messagesController';

const router = Router();

router.get('/messages/count', getMessageCount);

export default router;
